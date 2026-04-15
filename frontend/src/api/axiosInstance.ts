import axios from "axios";

// ✅ Detect environment
const isDev = import.meta.env.DEV;

// ✅ Dynamic base URL
const baseURL = isDev
  ? "http://localhost:5000"
  : "https://project-13-customer-management-system.onrender.com";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// ✅ Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const stored = localStorage.getItem("crm_session");

  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default axiosInstance;
