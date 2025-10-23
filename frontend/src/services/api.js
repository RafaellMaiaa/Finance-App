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

// --- ROTAS DE UTILIZADOR ---
export const getUserProfile = () => apiClient.get('/users/me');
export const updateUserProfile = (userData) => apiClient.put('/users/me', userData);

// --- ROTAS DE TRANSAÇÕES ---
export const getTransactions = () => apiClient.get('/transactions');
export const addTransaction = (transaction) => apiClient.post('/transactions', transaction);
export const deleteTransaction = (id) => apiClient.delete(`/transactions/${id}`);
export const generateRecurringTransactions = () => apiClient.post('/transactions/generate-recurring'); // ✅ Adicionado

// --- ROTA DA IA ---
export const askAi = (question) => apiClient.post('/ask-ai', { question });

// --- ROTAS DE CATEGORIAS ---
export const getCategories = () => apiClient.get('/categories');
export const createCategory = (categoryData) => apiClient.post('/categories', categoryData);
export const updateCategory = (id, categoryData) => apiClient.put(`/categories/${id}`, categoryData);
export const deleteCategory = (id) => apiClient.delete(`/categories/${id}`);

// --- ROTAS DE ORÇAMENTOS ---
export const getBudgets = (month, year) => apiClient.get(`/budgets?month=${month}&year=${year}`);
export const setBudget = (budgetData) => apiClient.post('/budgets', budgetData);
export const deleteBudget = (id) => apiClient.delete(`/budgets/${id}`);

// --- ✅ NOVAS ROTAS DE TRANSAÇÕES RECORRENTES ✅ ---
export const getRecurringTransactions = () => apiClient.get('/recurring-transactions');
export const createRecurringTransaction = (data) => apiClient.post('/recurring-transactions', data);
export const deleteRecurringTransaction = (id) => apiClient.delete(`/recurring-transactions/${id}`);