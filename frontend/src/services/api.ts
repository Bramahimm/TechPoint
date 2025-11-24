// src/services/api.ts
import axios from "axios";

// 1. Definisikan Base URL API Laravel Anda
// Ganti dengan URL backend Laravel yang sebenarnya (misal: "https://api.techpoint.com/api")
const API_BASE_URL = "http://localhost:8000/api";

// 2. Buat instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // Timeout request 10 detik
});

// 3. Tambahkan Interceptor (Opsional, tapi Sangat Direkomendasikan)
// Interceptor ini berfungsi untuk menyertakan token otorisasi (Bearer Token)
// pada setiap request yang dikirim ke backend.
api.interceptors.request.use(
  (config) => {
    // Ambil token dari Local Storage, Context, atau state management lainnya
    const token = localStorage.getItem("token");

    if (token) {
      // Pastikan formatnya sesuai standar Bearer Token
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
