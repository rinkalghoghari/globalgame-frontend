import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;

if (!baseURL) {
  console.warn("⚠️ Warning: NEXT_PUBLIC_BACKEND_ENDPOINT is not set. API calls will be skipped.");
}

const api = axios.create({
  baseURL: baseURL || "" ,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    "x-api-key": process.env.NEXT_PUBLIC_BACKEND_KEY
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
export default api;