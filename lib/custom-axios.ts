import axios from "axios";
import { useAuthStore } from "../store";
const myAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
});

myAxios.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken !== null) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

export default myAxios;
