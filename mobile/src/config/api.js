import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// API Base URL
// Use EXPO_PUBLIC_API_BASE_URL from .env (Expo exposes EXPO_PUBLIC_ variables).
// For local dev: set to your computer's LAN IP, e.g. http://192.168.1.100:5000
// For production: set to your Render/Railway/Vercel backend URL.
// ─────────────────────────────────────────────────────────────────────────────
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'https://library-management-system-backend-8cbu.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token automatically
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (_) {}
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalise errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
