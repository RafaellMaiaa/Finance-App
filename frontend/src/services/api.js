import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Esta função adiciona o token de sessão a todos os pedidos futuros
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Rotas de Autenticação
export const requestLoginLink = (email) => apiClient.post('/auth/login', { email });
export const verifyLoginToken = (token) => apiClient.post('/auth/verify', { token });

// Rotas de Transações (agora protegidas)
export const getTransactions = () => apiClient.get('/transactions');
export const addTransaction = (transaction) => apiClient.post('/transactions', transaction);
export const deleteTransaction = (id) => apiClient.delete(`/transactions/${id}`);

// Rota da IA (agora protegida)
export const askAi = (question) => apiClient.post('/ask-ai', { question });