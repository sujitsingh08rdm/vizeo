"use client";

import { ChildrenInterface } from "@/interface/children-interface";
import { AuthProvider } from "./auth-context";

export default function Providers({ children }: ChildrenInterface) {
  return <AuthProvider>{children}</AuthProvider>;
}
