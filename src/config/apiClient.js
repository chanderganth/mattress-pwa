import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api' });

api.interceptors.request.use(async (config) => {
  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.token) {
        config.headers.Authorization = 'Bearer ' + user.token;
      }
    } catch (e) {
      // Invalid JSON, ignore
    }
  }
  return config;
});

export default api;
