import axios from 'axios';
import { getStoredToken } from './authToken';

const baseURL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (!token) return config;

  config.headers = config.headers ?? {};
  if (!config.headers.Authorization && !config.headers.authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
