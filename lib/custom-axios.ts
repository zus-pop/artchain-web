import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store";

// const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://rflz4357-3001.asse.devtunnels.ms/api";
const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.artchain.io.vn/api";

if (process.env.NODE_ENV === "development") {
  console.log("🔧 myAxios baseURL:", baseURL);
}

const myAxios = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

myAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (process.env.NODE_ENV === "development") {
      console.log("🔑 Request:", config.method?.toUpperCase(), config.url);
      console.log("🔑 Token exists:", !!accessToken);
    }

    // Attach token if available
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error.message);
    return Promise.reject(error);
  }
);

myAxios.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Response:", response.config.url, response.status);
    }
    return response;
  },
  (error: AxiosError) => {
    if (process.env.NODE_ENV === "development") {
      console.error("❌ Response Error:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();

      //   if (typeof window !== "undefined") {
      //     window.location.href = "/auth?error=unauthorized";
      //   }
    }

    if (error.response?.status === 403) {
      console.error("🚫 Access Forbidden");
    }

    const errorData = error.response?.data as { message?: string } | undefined;
    const errorMessage =
      errorData?.message || error.message || "An unexpected error occurred";

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default myAxios;
