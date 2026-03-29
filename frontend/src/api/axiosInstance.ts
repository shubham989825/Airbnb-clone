import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? "https://airbnb-clone-hz9q.onrender.com/api"
    : "http://localhost:5000/api",
});

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

export default axiosInstance;