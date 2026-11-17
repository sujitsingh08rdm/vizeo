"use client";
import { ChildrenInterface } from "@/interface/children-interface";
import { ToastContainer } from "react-toastify";
import { io } from "socket.io-client";
export const webSocket = io(process.env.NEXT_PUBLIC_SERVER!);

const MainLayout = ({ children }: ChildrenInterface) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};

export default MainLayout;
