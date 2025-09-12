// src/api/axios.js
import axios from 'axios'

const isDev = import.meta.env.MODE === 'development'

// In production this uses VITE_API_URL (baked in at build time)
// In dev we use the Vite dev-proxy path "/api" so your calls stay same-origin
const baseURL = isDev ? '/api' : (import.meta.env.VITE_API_URL || 'https://api.nexoraspace.vishalsharmadev.in')

const api = axios.create({
  baseURL,
  timeout: 10000,
})

export default api
