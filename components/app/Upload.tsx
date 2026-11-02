import Image from "next/image";
import Card from "../shared/Card";
import Divider from "../shared/Divider";
import FormField from "../shared/FormField";
import StatusBadge from "../shared/StatusBadge";
import Button from "../shared/Button";

const Upload = () => {
  return (
    <div className="h-full">
      <h1 className="font-extrabold text-3xl">Uploads</h1>
      <Divider className="-mx-6" />

      <div className="flex mt-4 flex-col gap-4 md:grid md:grid-cols-12 md:items-start md:gap-6">
        {/* input + 3 recent uploads */}
        <div className="md:col-span-8 md:flex md:flex-col md:gap-12">
          <div className="relative w-full h-40 bg-gray-50 hover:bg-gray-100 hover:text-slate-800 flex flex-col items-center justify-center rounded-md border-2 border-dashed">
            <input
              type="file"
              className="h-full w-full absolute top-0 left-0 opacity-0"
            />
            <label className="text-lg font-semibold">
              Drag and drop a video here
            </label>
            <label className="text-gray-600 text-sm">
              or browse video files · MP4 up to 1 GB
            </label>
          </div>
          {/* Recent 3 uploads */}
          <div className="space-y-4 hidden md:block">
            <div className="font-semibold text-md m-2">Top 3 Uploads</div>
            <Card className="flex flex-col">
              <div className="space-x-2">
                <label className="text-xl font-bold">demo.mp4</label>
                <label className="text-sm font-base">311MB</label>
              </div>
              <div>
                <StatusBadge status="draft" />
              </div>
            </Card>
            <Card className="flex flex-col">
              <div className="space-x-2">
                <label className="text-xl font-bold">demo.mp4</label>
                <label className="text-sm font-base">311MB</label>
              </div>
              <div>
                <StatusBadge status="draft" />
              </div>
            </Card>
            <Card className="flex flex-col">
              <div className="space-x-2">
                <label className="text-xl font-bold">demo.mp4</label>
                <label className="text-sm font-base">311MB</label>
              </div>
              <div>
                <StatusBadge status="draft" />
              </div>
            </Card>
          </div>
        </div>
        {/* Upload with fields and bar form */}
        <div className="md:col-span-4 h-full">
          <h2 className="font-semibold mb-4 text-xl">Output Settings</h2>
          <form className="p-2 space-y-4">
            <input
              name="video-name"
              className="px-2 py-1 rounded ring-2 ring-gray-300 w-full"
              placeholder="Enter video title"
            />
            <input
              name="video-description"
              className="px-2 py-1 rounded ring-2 ring-gray-300 w-full"
              placeholder="Enter video description"
            />
            <div className="relative border border-gray-700 bg-gray-50 hover:bg-gray-100 rounded p-2 border-dashed">
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
            </div>
            <Button>Upload</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
