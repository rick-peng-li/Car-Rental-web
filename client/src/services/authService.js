import apiClient from './apiClient';

export const authService = {
  login: (payload) => apiClient.post('/auth/login', payload).then((res) => res.data.data),
  register: (payload) =>
    apiClient.post('/auth/register', payload).then((res) => res.data.data),
  getProfile: () => apiClient.get('/auth/me').then((res) => res.data.data),
};
