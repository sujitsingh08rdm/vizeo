import { isAxiosError } from "axios";
import { toast } from "react-toastify";

export const catchError = (err: unknown) => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "dev") {
    console.log(err);
  }

  if (isAxiosError(err)) {
    return toast.error(
      err.response?.data.message || "Unknown error from Server",
    );
  }
  if (err instanceof Error) {
    return toast.error(err.message || "unknown error from Client");
  }
  return toast.error("Unknown Error");
};
