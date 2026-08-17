import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password });

export const registerUser = (userData) =>
  api.post('/auth/register', userData);

export const getBooks = () => api.get('/books');

export const getCategories = () => api.get('/categories');

export const getReadingHistory = () => api.get('/reading-history');

export const saveReadingHistory = (data) =>
  api.post('/reading-history', data);

export const getMyProfile = () => api.get('/users/me');

export const updateMyProfile = (data) => api.put('/users/me', data);

export const getDashboardStats = () => api.get('/admin/stats');

export const getNotifications = () => api.get('/notifications');

export const markAllNotificationsRead = () => api.put('/notifications/read-all');
