import { User } from "lucide-react";
import Divider from "../shared/Divider";
import Button from "../shared/Button";

const Settings = () => {
  return (
    <div className="h-full">
      <h1 className="font-extrabold text-3xl">Settings</h1>
      <Divider className="-mx-6" />
      <div>
        <div className="p-4 flex items-center gap-2">
          <button
            type="button"
            aria-label="Account"
            className="cursor-pointer text-gray-700 hover:text-gray-900"
          >
            <User
              width={84}
              height={84}
              className="bg-gray-200 rounded-full p-2"
            />
          </button>
          <div className="text-blue-500 cursor-pointer text text-semibold">
            Change avatar
          </div>
        </div>
        <form className="w-70 md:w-100 space-y-2">
          <input
            name="video-name"
            className="px-2 py-1 rounded ring-2 ring-gray-300 w-full"
            placeholder="Change full name"
          />
          <Button className="px-4 py-2">Save Changes</Button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
