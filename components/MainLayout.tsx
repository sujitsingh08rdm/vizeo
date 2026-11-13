import { ChildrenInterface } from "@/interface/children-interface";
import { ToastContainer } from "react-toastify";

const MainLayout = ({ children }: ChildrenInterface) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};

export default MainLayout;
