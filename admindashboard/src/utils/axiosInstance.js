import axios from "axios";
import { ENV } from "../utils/env";

const axiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token =localStorage.getItem("token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers["x-access-token"];
    if (newAccessToken) {
      localStorage.setItem("token", newAccessToken);
    }
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // logout or refresh token logic can go here
      // For now, if we get 401, it likely means the refresh token also failed or wasn't present
      // localStorage.removeItem("token");
      // window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
