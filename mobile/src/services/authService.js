import api from '../config/api';

export const authService = {
  forgotPassword: (email) =>
    api.post('/api/auth/forgot-password', { email }),

  verifyOTP: (email, otp) =>
    api.post('/api/auth/verify-otp', { email, otp }),

  resetPassword: (email, otp, newPassword) =>
    api.post('/api/auth/reset-password', { email, otp, newPassword }),
};
