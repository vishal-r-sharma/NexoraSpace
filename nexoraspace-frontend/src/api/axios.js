// src/api/axios.js
import axios from 'axios'

const isDev = import.meta.env.MODE === 'development'

// If you prefer an explicit override, set VITE_API_URL in .env.production
const prodApi = import.meta.env.VITE_API_URL || 'https://api.nexoraspace.vishalsharmadev.in'

// In dev use relative '/api' so Vite proxy handles forwarding to localhost:5000
const baseURL = isDev ? '' : prodApi

const api = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true, // include cookies for every request
})

export default api
