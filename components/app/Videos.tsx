"use client";

import Image from "next/image";
import Divider from "../shared/Divider";
import { Copy } from "lucide-react";
import StatusBadge, { VideoStatus } from "../shared/StatusBadge";
import Link from "next/link";
import Fetcher from "@/lib/fetcher/swr-fetcher";
import useSWR from "swr";
import moment from "moment";

interface Video {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  status: VideoStatus;
}

const AVAILABLE_QUALITY = ["360p", "480p", "720p", "1080p"];

/* One row in the video list: thumbnail beside the text, so the list stays compact */
const VideoListItem = ({ video }: { video: Video }) => (
  <li>
    <Link
      href={`/app/videos/${video._id}`}
      className="flex gap-3 rounded-lg p-2 hover:bg-gray-50"
    >
      <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded bg-gray-200 sm:w-44 md:w-32 lg:w-40">
        <Image
          src="/images/thumb.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 160px, 176px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold sm:text-base">
          {video.title}
        </h3>
        <p className="mt-1 text-xs text-gray-600 sm:text-sm">
          {moment(video.createdAt).format("hh:mm, DD MMM, YY")}
        </p>
        <StatusBadge status={video.status} tone="neutral" className="mt-2" />
      </div>
    </Link>
  </li>
);

const Videos = () => {
  const { data, isLoading, error } = useSWR("/video", Fetcher);

  if (isLoading) {
    return <div>Fetching...</div>;
  }

  if (error) {
    return <div>Something went wrong while Fetching Videos{error}</div>;
  }
  const current = data.videos[0];
  console.log(data);
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
              <Image
                src="/images/thumb.webp"
                alt={current.title}
                fill
                priority
                sizes="(min-width: 768px) 66vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* title + description + actions (scrolls on phones) */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-bold sm:text-xl">{current.title}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {current.description}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Uploaded on{" "}
                <span className="font-semibold text-gray-900">
                  {current.uploadedAt}
                </span>
              </p>
            </div>

            {/* quality + copy link: a row on phones, a column on sm+ */}
            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <select
                defaultValue="720p"
                aria-label="Video quality"
                className="cursor-pointer rounded border border-gray-300 p-1 text-sm shadow-sm"
              >
                {AVAILABLE_QUALITY.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1 text-sm text-gray-700 hover:text-gray-900"
              >
                <Copy className="size-4" /> Copy link
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- video list ---------------- */}
        <aside className="md:col-span-4">
          <h2 className="mb-3 text-lg font-semibold">Video list</h2>
          <ul className="space-y-1">
            {data.videos.map((v: Video) => (
              <VideoListItem key={v._id} video={v} />
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Videos;
