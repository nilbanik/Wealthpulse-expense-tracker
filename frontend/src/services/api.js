import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (name, email, password, seed_demo_data = false) =>
    api.post('/api/auth/register', { name, email, password, seed_demo_data }),
  getProfile: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  changePassword: (data) => api.put('/api/auth/change-password', data),
};

export const transactionService = {
  getAll: (params = {}) => api.get('/api/transactions', { params }),
  getById: (id) => api.get(`/api/transactions/${id}`),
  create: (data) => api.post('/api/transactions', data),
  update: (id, data) => api.put(`/api/transactions/${id}`, data),
  delete: (id) => api.delete(`/api/transactions/${id}`),
  exportCsvUrl: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return `${API_BASE_URL}/api/transactions/export/csv${query ? `?${query}` : ''}`;
  },
  downloadCsv: async (params = {}) => {
    const response = await api.get('/api/transactions/export/csv', {
      params,
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};

export const budgetService = {
  getAll: (month) => api.get('/api/budgets', { params: { month } }),
  setBudget: (data) => api.post('/api/budgets', data),
  delete: (id) => api.delete(`/api/budgets/${id}`),
};

export const analyticsService = {
  getSummary: (month) => api.get('/api/analytics/summary', { params: { month } }),
  getCategories: (params = {}) => api.get('/api/analytics/categories', { params }),
  getMonthlyTrend: (monthsCount = 6) => api.get('/api/analytics/monthly-trend', { params: { months_count: monthsCount } }),
  getPaymentMethods: (month) => api.get('/api/analytics/payment-methods', { params: { month } }),
  seedDemoData: () => api.post('/api/analytics/seed'),
};

export default api;
