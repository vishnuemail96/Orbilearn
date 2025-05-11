// src/api/register.js
import axios from 'axios';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || '' 
});

// Add request interceptor for authentication if needed
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for handling common errors
API.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // Handle 401 unauthorized errors
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    // Redirect to login
    window.location.href = '/api/login/';
  }
  return Promise.reject(error);
});

export default API;