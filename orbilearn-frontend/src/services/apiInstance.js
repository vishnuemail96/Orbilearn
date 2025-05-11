import axios from 'axios';

// Create an axios instance with the base URL from environment variable
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add response interceptor for better error handling
API.interceptors.response.use(
  response => response,
  error => {
    // Log the error for debugging
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default API;