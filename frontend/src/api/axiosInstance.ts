import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// 🔥 Attach token automatically
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
