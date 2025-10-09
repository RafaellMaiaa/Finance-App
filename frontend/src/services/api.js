import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const getUserProfile = () => apiClient.get('/users/me');
export const updateUserProfile = (userData) => apiClient.put('/users/me', userData);
export const getTransactions = () => apiClient.get('/transactions');
export const addTransaction = (transaction) => apiClient.post('/transactions', transaction);
export const deleteTransaction = (id) => apiClient.delete(`/transactions/${id}`);
export const askAi = (question) => apiClient.post('/ask-ai', { question });