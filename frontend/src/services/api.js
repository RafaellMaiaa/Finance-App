import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Esta função é o coração da autenticação. Ela configura o axios
// para enviar o token em todos os pedidos futuros.
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// --- ROTAS DE AUTENTICAÇÃO ---
export const requestLoginLink = (email) => apiClient.post('/auth/login', { email });
export const verifyLoginToken = (token) => apiClient.post('/auth/verify', { token });

// --- ROTAS DE UTILIZADOR ---
export const getUserProfile = () => apiClient.get('/users/me');
export const updateUserProfile = (userData) => apiClient.put('/users/me', userData);

// --- ROTAS DE TRANSAÇÕES (protegidas) ---
export const getTransactions = () => apiClient.get('/transactions');
export const addTransaction = (transaction) => apiClient.post('/transactions', transaction);
export const deleteTransaction = (id) => apiClient.delete(`/transactions/${id}`);

// --- ROTA DA IA (protegida) ---
export const askAi = (question) => apiClient.post('/ask-ai', { question });