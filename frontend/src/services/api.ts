import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor CSRF
api.interceptors.request.use((config) => {
  const match = document.cookie.match(new RegExp("(^| )XSRF-TOKEN=([^;]+)"));
  if (match) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(match[2]);
  }
  return config;
});

export default api;
