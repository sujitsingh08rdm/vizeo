import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const httpRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER,
  withCredentials: true,
});

// Prevent infinite retry
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;

let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

const AUTH_URLS = [
  "/auth/login",
  "/auth/signup",
  "/auth/logout",
  "/auth/refresh-token",
];

httpRequest.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      AUTH_URLS.some((u) => originalRequest.url?.includes(u))
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => httpRequest(originalRequest));
    }

    isRefreshing = true;
    try {
      await httpRequest.post("/auth/refresh-token");
      processQueue();
      return httpRequest(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      if (
        typeof window !== "undefined" &&
        (window.location.pathname === "/app" ||
          window.location.pathname.startsWith("/app/"))
      ) {
        window.location.href = "/auth/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default httpRequest;
