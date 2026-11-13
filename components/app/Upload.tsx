"use client";

import Card from "../shared/Card";
import Divider from "../shared/Divider";
import StatusBadge from "../shared/StatusBadge";
import Button from "../shared/Button";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { getVideoDuration, sizeCalculator } from "@/lib/utils";
import { X } from "lucide-react";
import { catchError } from "@/lib/catch-error";
import httpRequest from "@/lib/http-request/axios-http-request";
import axios from "axios";
import { toast } from "react-toastify";
import ProgressBar from "../shared/ProgressBar";
import { FieldErrors, parseForm } from "@/lib/validations/parseForm";
import { videoSchema } from "@/lib/validations/video";
import { validateFile } from "@/lib/validations/file";
import { cn } from "@/lib/utils";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    const error = validateFile(selectedFile, {
      maxSize: 1024 * 1024 * 1024,
      allowedTypes: ["video/mp4"],
    });

    if (error) {
      setFile(null);
      setFileError(error);
      e.target.value = "";
      return;
    }
    setFileError(null);
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const uploadVideo = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!file) {
        throw new Error("No File Found");
      }
      setIsUploading(true);
      const form = e.currentTarget;
      const formData = new FormData(form);

      const value: Record<string, FormDataEntryValue | number> =
        Object.fromEntries(formData.entries());

      const duration = await getVideoDuration(file);

      value.duration = duration as number;
      value.size = file.size;

      const { errors } = parseForm(videoSchema, formData);

      if (errors) {
        setErrors(errors);
        return;
      }

      delete value.file;
      setErrors({});

      const fileValidationError = validateFile(file, {
        maxSize: 1024 * 1024 * 1024,
        allowedTypes: ["video/mp4"],
      });

      if (fileValidationError) {
        setFileError(fileValidationError);
        return;
      }

      const response = await httpRequest.post("/video", value);
      const uploadUrl = response.data.uploadUrl;
      const options = {
        headers: { "Content-Type": file.type },
        onUploadProgress: (e: any) => {
          let p = Math.floor((e.loaded * 100) / e.total);
          setProgress(p);
        },
      };

      await axios.put(uploadUrl, file, options);
      toast.success("File Uploaded S3 successfull");
      form.reset();
      setFile(null);
    } catch (error) {
      catchError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearError = (e: SyntheticEvent<HTMLFormElement>) => {
    const { name } = e.target as HTMLInputElement;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="h-full">
      <h1 className="font-extrabold text-3xl">Uploads</h1>
      <Divider className="-mx-6" />

      <div className="flex mt-4 flex-col gap-4 md:grid md:grid-cols-12 md:items-start md:gap-6">
        <div className="mt-8 md:col-span-6 lg:col-span-7 hidden md:flex md:flex-col md:gap-12">
          {/* Recent 3 uploads */}
          <div className="space-y-4 hidden md:block">
            <div className="font-semibold text-md m-2">Top 3 Uploads</div>
            <Card className="flex flex-col">
              <div className="space-x-2">
                <label className="text-xl font-bold">demo.mp4</label>
                <label className="text-sm font-base">311MB</label>
              </div>
              <div>
                <StatusBadge status="converting" />
              </div>
            </Card>
            <Card className="flex flex-col">
              <div className="space-x-2">
                <label className="text-xl font-bold">demo.mp4</label>
                <label className="text-sm font-base">311MB</label>
              </div>
              <div>
                <StatusBadge status="converting" />
              </div>
            </Card>
            <Card className="flex flex-col">
              <div className="space-x-2">
                <label className="text-xl font-bold">demo.mp4</label>
                <label className="text-sm font-base">311MB</label>
              </div>
              <div>
                <StatusBadge status="converting" />
              </div>
            </Card>
          </div>
        </div>
        {/* Upload with fields and bar form */}
        <div className="md:col-span-6 lg:col-span-5 flex-1 p-4 h-full">
          <h2 className="font-semibold mb-4 text-xl">Output Settings</h2>
          <form
            className="p-2 space-y-4"
            onSubmit={uploadVideo}
            onChange={clearError}
          >
            <input
              name="title"
              className={cn(
                "px-2 py-1 rounded ring-2 ring-gray-300 w-full",
                isUploading && "cursor-not-allowed opacity-75",
              )}
              placeholder="Enter video title"
              disabled={isUploading}
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title}</p>
            )}
            <input
              name="description"
              className={cn(
                "px-2 py-1 rounded ring-2 ring-gray-300 w-full",
                isUploading && "cursor-not-allowed opacity-75",
              )}
              placeholder="Enter video description"
              disabled={isUploading}
            />
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
            <div
              className={cn(
                "relative w-full h-40 bg-gray-50 hover:bg-gray-100 hover:text-slate-800 flex flex-col items-center justify-center rounded-md border-2 border-dashed",
                isUploading && "cursor-not-allowed opacity-75",
              )}
            >
              {file ? (
                <div className="relative p-8 border flex flex-col text-gray-700">
                  <label>
                    Filename: <span className="font-semibold">{file.name}</span>
                  </label>
                  <label>
                    File Size :{" "}
                    <span className="font-semibold">
                      {sizeCalculator(file.size)}
                    </span>
                  </label>
                  <button
                    disabled={isUploading}
                    onClick={() => setFile(null)}
                    className={cn(
                      "absolute -top-3 -right-3 border rounded-full cursor-pointer hover:text-black hover:border-black",
                      isUploading && "cursor-not-allowed",
                    )}
                  >
                    <X />
                  </button>
                </div>
              ) : (
                <>
                  <input
                    name="file"
                    type="file"
                    accept="video/mp4"
                    onChange={handleFile}
                    className="h-full w-full absolute top-0 left-0 opacity-0 cursor-pointer"
                  />
                  <label className="text-lg font-semibold">
                    Drag and drop a video here
                  </label>
                  <label className="text-gray-600 text-sm">
                    or browse video files · MP4 up to 1 GB
                  </label>
                </>
              )}
            </div>
            {fileError && (
              <p className="text-xs text-red-500 font-medium">{fileError}</p>
            )}
            {/* <div className="relative border border-gray-700 bg-gray-50 hover:bg-gray-100 rounded p-2 border-dashed">
              <input
                type="file"
                className="h-full w-full absolute top-0 left-0 opacity-0"
              />
              <label className="text-md  text-gray-600 font-semibold">
                Select Thumbnail
              </label>
              <Image
                src="/images/thumb.webp"
                height={360}
                width={280}
                alt="thumb"
              />
            </div> */}

            {progress > 0 && <ProgressBar progress={progress} />}
            {progress === 100 && (
              <label className="text-xs text-black font-semibold">
                File Uploaded Successfully..
              </label>
            )}
            <Button
              disabled={isUploading}
              className={isUploading ? "cursor-not-allowed" : ""}
            >
              Upload
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
