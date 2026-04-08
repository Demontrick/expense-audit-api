import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5245/api',
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('user');
  if (stored) {
    const user = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (email: string, password: string, role: string) => {
    const res = await api.post('/auth/register', { email, password, role });
    return res.data;
  },
};

export const expenseService = {
  getAll: async (flagged?: boolean) => {
    const params = flagged !== undefined ? { flagged } : {};
    const res = await api.get('/expenses', { params });
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get(`/expenses/${id}`);
    return res.data;
  },
  create: async (data: { vendor: string; amount: number; category: string; submittedBy: string }) => {
    const res = await api.post('/expenses', data);
    return res.data;
  },
  delete: async (id: number) => {
    await api.delete(`/expenses/${id}`);
  },
};

export default api;