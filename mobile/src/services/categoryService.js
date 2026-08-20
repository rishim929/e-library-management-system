import api from '../config/api';

export const categoryService = {
  getAll: () => api.get('/api/categories'),
};
