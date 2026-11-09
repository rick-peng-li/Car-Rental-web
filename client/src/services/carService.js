import apiClient from './apiClient';

export const carService = {
  getAll: () => apiClient.get('/cars').then((res) => res.data.data),
  getById: (id) => apiClient.get(`/cars/${id}`).then((res) => res.data.data),
  create: (payload) => apiClient.post('/cars', payload).then((res) => res.data.data),
  update: (id, payload) =>
    apiClient.put(`/cars/${id}`, payload).then((res) => res.data.data),
  remove: (id) => apiClient.delete(`/cars/${id}`).then((res) => res.data),
};
