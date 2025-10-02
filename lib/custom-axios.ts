import axios from "axios";
import { useAuthStore } from "../store";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://rflz4357-3000.asse.devtunnels.ms/api";
console.log("🔧 myAxios baseURL:", baseURL);

const myAxios = axios.create({
  baseURL: baseURL,
});

myAxios.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  console.log("🔑 myAxios interceptor - token exists:", !!accessToken);
  console.log("🔑 Request URL:", config.url);
  
  if (accessToken !== null) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
    console.log("🔑 Authorization header set");
  } else {
    console.log("🔑 No token available");
  }
  return config;
});

// Response interceptor to log responses and handle errors
myAxios.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default myAxios;
