import api from '../config/api';

export const subscriptionService = {
  upgrade: () => api.post('/api/subscriptions/upgrade'),
  initiatePayment: (amount, purchase_order_id, purchase_order_name) =>
    api.post('/api/payments/initiate', { amount, purchase_order_id, purchase_order_name }),
  verifyPayment: (pidx) =>
    api.post('/api/payments/verify', { pidx }),
};
