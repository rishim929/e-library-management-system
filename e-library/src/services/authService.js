import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/auth`;

export const login = (data) => axios.post(`${API}/login`, data);

export const register = (data) => axios.post(`${API}/register`, data);

export const forgotPassword = (data) => axios.post(`${API}/forgot-password`, data);

export const verifyOTP = (data) => axios.post(`${API}/verify-otp`, data);

export const resetPassword = (data) => axios.post(`${API}/reset-password`, data);