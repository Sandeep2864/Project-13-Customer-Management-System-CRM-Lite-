import axios from "axios";
import { getStoredToken } from "../utils/authStorage";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const axiosInstance = axios.create({
  baseURL: configuredBaseUrl && configuredBaseUrl.length > 0
    ? configuredBaseUrl
    : "http://localhost:5000",
});

axiosInstance.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;