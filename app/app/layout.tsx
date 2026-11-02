import AppLayout from "@/components/app/AppLayout";
import { ChildrenInterface } from "@/interface/children-interface";
import React from "react";

const AppLayoutRouter = ({ children }: ChildrenInterface) => {
  return <AppLayout>{children}</AppLayout>;
};

export default AppLayoutRouter;
