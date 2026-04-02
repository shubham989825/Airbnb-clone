import axios from "axios";

const API_BASE_URL = import.meta.env.DEV 
  ? "http://localhost:5000/api"
  : "https://airbnb-clone-hz9q.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

console.log("API Base URL:", API_BASE_URL);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error logging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default axiosInstance;