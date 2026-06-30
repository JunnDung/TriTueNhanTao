// ============================================================
// API Service – Axios instance with mock interceptors
// ============================================================
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tcsa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error?.response?.data?.message || error.message || 'Đã xảy ra lỗi';
    return Promise.reject(new Error(message));
  }
);

// Mock API endpoints (for demo without backend)
export const mockApi = {
  analyzText: (text) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, text });
      }, 1200 + Math.random() * 800);
    }),

  getStats: () =>
    new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 400);
    }),

  deleteComment: (id) =>
    new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, id }), 300);
    }),

  approveComment: (id) =>
    new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, id }), 300);
    }),
};

export default api;
