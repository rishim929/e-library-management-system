import api from '../config/api';

export const historyService = {
  getMyHistory: () => api.get('/api/reading-history'),
  saveHistory: (book_id, last_page) =>
    api.post('/api/reading-history', { book_id, last_page }),
};
