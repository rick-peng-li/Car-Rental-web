import apiClient from './apiClient';

export const bookingService = {
  create: (payload) =>
    apiClient.post('/bookings', payload).then((res) => res.data.data),
  getMine: () => apiClient.get('/bookings/my').then((res) => res.data.data),
  getAll: () => apiClient.get('/bookings').then((res) => res.data.data),
  cancel: (id) => apiClient.delete(`/bookings/${id}`).then((res) => res.data),
};
