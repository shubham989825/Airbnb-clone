import axios from "axios";

const API_BASE_URL = import.meta.env.DEV 
  ? "http://127.0.0.1:5000/api"
  : "https://airbnb-clone-hz9q.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

console.log("API Base URL:", API_BASE_URL);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Ensure headers object exists (safer across axios versions)
    if (!config.headers) config.headers = {} as any;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Axios - attaching token (first 30 chars):', token.substring(0, 30));
    } else {
      console.log('Axios - no token found in localStorage');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error logging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;