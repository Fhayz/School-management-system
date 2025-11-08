// src/api.js
import axios from "axios";


const BASE_URL = "http://localhost:8001/api/v1"; // Your API base URL

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Automatically add the JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from browser storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set header
    }
    return config;
  },
  (error) => Promise.reject(error)
);
