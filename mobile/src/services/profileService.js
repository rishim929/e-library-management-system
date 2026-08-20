import api from '../config/api';

export const profileService = {
  getMe: () => api.get('/api/users/me'),
  updateMe: (data) => api.put('/api/users/me', data),
};
