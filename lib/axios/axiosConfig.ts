import axios from 'axios';
import { getState } from '../store/store';

const api = axios.create({
  baseURL: 'http://localhost:9000',
});


api.interceptors.request.use((config) => {
  const { token, username } = getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (username) {
    config.headers['X-Username'] = username;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data.message;
      if (errorMessage === 'Token expired' && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { token, username, refreshToken } = getState();
          await refreshToken();
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          if (username) {
            originalRequest.headers['X-Username'] = username;
          }
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;