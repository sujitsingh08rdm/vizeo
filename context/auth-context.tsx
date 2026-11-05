"use client";

import { ChildrenInterface } from "@/interface/children-interface";
import httpRequest from "@/lib/http-request/axios-http-request";
import { AuthContextInterface, UserInterface } from "@/types/auth.types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<AuthContextInterface | null>(null);

export function AuthProvider({ children }: ChildrenInterface) {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = useCallback(async () => {
    try {
      const { data } = await httpRequest.get("/auth/session");

      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set user after successful login
  const login = useCallback(async () => {
    await initializeAuth();
  }, []);

  const logout = useCallback(async () => {
    try {
      await httpRequest.post("/auth/logout");
    } finally {
      setUser(null);
    }
  }, []);

  // Initialize authentication only once on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const value: AuthContextInterface = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    login,
    logout,
    initializeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
