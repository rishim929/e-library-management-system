import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const login = (data) => axios.post(`${API}/login`, data);

export const register = (data) => axios.post(`${API}/register`, data);

export const forgotPassword = (data) => axios.post(`${API}/forgot-password`, data);

export const verifyOTP = (data) => axios.post(`${API}/verify-otp`, data);

export const resetPassword = (data) => axios.post(`${API}/reset-password`, data);