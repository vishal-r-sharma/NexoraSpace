// src/api/axios.js
import axios from "axios";

// Detect mode
const isDev = import.meta.env.MODE === "development";

// Backend base URLs
const devApi = "http://localhost:5000"; // local backend
const prodApi =
  import.meta.env.VITE_API_URL || "https://api.nexoraspace.vishalsharmadev.in";

// Choose correct base URL
const baseURL = isDev ? devApi : prodApi;

// Create axios instance
const api = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true, // ✅ send & receive cookies
});

export default api;
