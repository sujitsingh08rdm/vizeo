"use client";

import Image from "next/image";
import Divider from "../shared/Divider";
import {
  ImageIcon,
  ImagePlusIcon,
  Pencil,
  PlayCircle,
  Trash,
} from "lucide-react";
import StatusBadge, { VideoStatus } from "../shared/StatusBadge";
import Fetcher from "@/lib/fetcher/swr-fetcher";
import useSWR, { mutate } from "swr";
import moment from "moment";
import { useEffect, useState } from "react";
import { webSocket } from "../MainLayout";
import httpRequest from "@/lib/http-request/axios-http-request";
import VideoPlayer from "../shared/ReactPlayer";
import { cn } from "cn";
import { catchError } from "@/lib/catch-error";
import { toast } from "react-toastify";
import axios from "axios";
import ProgressBar from "../shared/ProgressBar";

interface Video {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  status: VideoStatus;
  streamPath?: string;
  plays: string;
  thumbnail: ThumbnailInterface;
}

interface ThumbnailInterface {
  high?: {
    path: string;
    width: number;
    height: number;
  };
  medium?: {
    path: string;
    width: number;
    height: number;
  };
  low?: {
    path: string;
    width: number;
    height: number;
  };
}

const AVAILABLE_QUALITY = ["360p", "480p", "720p", "1080p"];

/* One row in the video list: thumbnail beside the text, so the list stays compact */
const VideoListItem = ({
  video,
  setCurrentVideo,
  setVideoSrc,
}: {
  video: Video;
  setCurrentVideo: React.Dispatch<React.SetStateAction<Video>>;
  setVideoSrc: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const image =
    video.thumbnail?.medium || video.thumbnail?.high || video.thumbnail?.low;

  return (
    <li
      onClick={() => {
        setCurrentVideo(video);
        setVideoSrc("");
      }}
    >
      <div className="flex gap-3 rounded-lg p-2 hover:bg-gray-100">
        <div
          className={cn(
            "relative aspect-video w-32 shrink-0 overflow-hidden rounded bg-gray-200 sm:w-44 md:w-32 lg:w-40",
            video.status === "published" && "cursor-pointer",
          )}
        >
          <Image
            src={
              image
                ? `${process.env.NEXT_PUBLIC_CDN}/${image.path}`
                : "/images/thumb.webp"
            }
            alt=""
            fill
            sizes="(min-width: 1024px) 160px, 176px"
            className="object-cover"
          />
          {video.status === "published" && (
            <button
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white p-1 rounded-full transition-all duration-300 ease-in-out hover:bg-black/80 hover:scale-110 active:scale-95 shadow-lg",
                video.status === "published" && "cursor-pointer",
              )}
            >
              <PlayCircle className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold sm:text-base">
            {video.title}
          </h3>
          <p className="mt-1 text-xs! text-gray-600 sm:text-sm">
            {video.plays == "0" ? "No Views" : `${video.plays} Views`}{" "}
          </p>
          <StatusBadge status={video.status} tone="neutral" className="mt-1" />
          <p className="mt-1 text-xs! text-gray-600 sm:text-sm">
            {moment(video.createdAt).fromNow()}
          </p>
        </div>
      </div>
    </li>
  );
};

const Videos = () => {
  const { data, isLoading, error } = useSWR("/video", Fetcher);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<Video>({
    _id: "",
    title: "",
    description: "",
    createdAt: "",
    status: "draft",
    plays: "",
    thumbnail: {},
  });
  const image =
    currentVideo.thumbnail?.high ||
    currentVideo.thumbnail?.medium ||
    currentVideo.thumbnail?.low;

  const onVideoConverting = () => {
    mutate(`/video`);
  };

  useEffect(() => {
    webSocket.on("video-converting", onVideoConverting);

    return () => {
      webSocket.off("video-converting", onVideoConverting);
    };
  }, []);

  useEffect(() => {
    if (!data?.videos?.length) return;

    setCurrentVideo((prev) => {
      // Initial selection
      if (!prev._id) {
        return data.videos[0];
      }

      // Preserve current selection after SWR revalidation
      const updatedVideo = data.videos.find(
        (video: Video) => video._id === prev._id,
      );

      // Update selected video with fresh server data
      if (updatedVideo) {
        return updatedVideo;
      }

      // Current video was deleted
      return data.videos[0];
    });
  }, [data]);

  if (isLoading) {
    return <div>Fetching...</div>;
  }

  if (error) {
    return <div>Something went wrong while Fetching Videos{error}</div>;
  }

  const handleThumbnailChange = (id: string) => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();

      input.onchange = () => {
        if (!input.files) {
          throw new Error("No File uploaded");
        }
        const file = input.files[0];
        input.remove();
        const url = URL.createObjectURL(file);
        const img = new window.Image();
        img.src = url;
        img.onload = async () => {
          if (img.width !== 1280 || img.height !== 720) {
            return toast.error("Image Resolution must be 1280/720");
          }
          const { data } = await httpRequest.post("/video/thumbnail", {
            videoId: currentVideo._id,
          });
          const options = {
            headers: { "Content-Type": file.type },
            onUploadProgress: (e: any) => {
              let p = Math.floor((e.loaded * 100) / e.total);
              setProgress(p);
            },
          };
          await axios.put(data.uploadUrl, file, options);
          toast.success("Thumbanil Updated");
          mutate("/video");
        };
      };
    } catch (error) {
      catchError(error);
    }
  };

  const playVideo = async (path: string) => {
    try {
      const { data } = await httpRequest.post("/video/stream", { path: path });
      setVideoSrc(data.url);
      await httpRequest.put(`/video/${currentVideo._id}/plays`);
    } catch (error) {
      catchError(error);
    }
  };

  if (data.videos.length === 0) {
    return <div>No Videos Uploaded.. Please Upload</div>;
  }

  return (
    <div className="h-full">
      <h1 className="font-extrabold text-3xl">My Videos</h1>
      <Divider className="-mx-6" />

      <div className="mt-8 flex flex-col gap-4 md:grid md:grid-cols-12 md:items-start md:gap-6">
        {/* ---------------- player + details ---------------- */}
        <div className="contents md:sticky md:top-0 md:col-span-8 md:flex md:flex-col md:gap-4">
          {/* sticky on phones only. -mx-4 matches the layout's p-4 on <md so the
              white background covers the full width and nothing shows beside it */}
          <div className="sticky top-0 z-10 -mx-4 border-b border-gray-200 bg-white px-4 pb-3 md:static md:mx-0 md:border-0 md:p-0">
            <div className="relative aspect-video max-h-[40dvh] w-full overflow-hidden rounded-lg bg-black md:max-h-none">
              {/* give video this class : className="absolute inset-0 h-full w-full object-contain" */}
              {currentVideo.status === "published" && videoSrc ? (
                <VideoPlayer src={videoSrc} />
              ) : (
                <>
                  <Image
                    src={
                      image
                        ? `${process.env.NEXT_PUBLIC_CDN}/${image.path}`
                        : "/images/thumb.webp"
                    }
                    alt={currentVideo.title}
                    fill
                    priority
                    sizes="(min-width: 768px) 66vw, 100vw"
                    className="object-contain"
                  />
                  {currentVideo.status === "published" && (
                    <button
                      onClick={() => {
                        playVideo(currentVideo.streamPath as string);
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white cursor-pointer p-4 rounded-full transition-all duration-300 ease-in-out hover:bg-black/70 hover:scale-110 active:scale-95 shadow-lg"
                    >
                      <PlayCircle className="w-12 h-12" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* title + description + actions (scrolls on phones) */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-bold sm:text-xl">
                {currentVideo.title}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {currentVideo.description}
              </p>
              <div>
                {progress > 0 && <ProgressBar progress={progress} />}
                {progress === 100 && (
                  <div>
                    <label className="text-xs text-black font-semibold">
                      Thumbnail Changed
                    </label>
                    <button
                      onClick={() => handleThumbnailChange(currentVideo._id)}
                      className="flex flex-row gap-2 text-md cursor-pointer text-indigo-600 hover:text-indigo-800"
                    >
                      <span className="font-medium">Change Again</span>
                      <ImagePlusIcon className="w-4" />
                    </button>
                  </div>
                )}
                {progress === 0 && (
                  <button
                    onClick={() => handleThumbnailChange(currentVideo._id)}
                    className="flex flex-row gap-2 text-md cursor-pointer text-indigo-600 hover:text-indigo-800"
                  >
                    <span className="font-medium">Change Thumbnail</span>{" "}
                    <ImageIcon className="w-4" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Uploaded{" "}
                <span className="font-semibold text-gray-900">
                  {moment(currentVideo.createdAt).fromNow()}
                </span>
              </p>
            </div>

            {/* quality + copy link: a row on phones, a column on sm+ */}
            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <p className="text-sm! text-gray-700 font-medium sm:text-sm">
                {currentVideo.plays == "0"
                  ? "No Views"
                  : `${currentVideo.plays} Views`}
              </p>
              <StatusBadge status={currentVideo.status} />
              <div className="flex items-center gap-4">
                <button className="cursor-pointer text-red-400 hover:text-red-600 active:scale-105">
                  <Trash size={18} />
                </button>
                <button className="cursor-pointer text-indigo-400 hover:text-indigo-600 active:scale-105">
                  <Pencil size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- video list ---------------- */}
        <aside className="md:col-span-4">
          <h2 className="mb-3 text-lg font-semibold">Video list</h2>
          <ul className="space-y-1">
            {data.videos.map((v: Video) => (
              <VideoListItem
                setVideoSrc={setVideoSrc}
                setCurrentVideo={setCurrentVideo}
                key={v._id}
                video={v}
              />
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Videos;
