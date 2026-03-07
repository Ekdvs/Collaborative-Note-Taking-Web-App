import axios from "axios";
import { baseUrl } from "../api/SummaryApi";

export const Axios = axios.create(
    {
        baseURL:baseUrl,
        withCredentials:true
    }
)

// Automatically add Authorization header
Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);