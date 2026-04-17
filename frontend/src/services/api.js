import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Securely attach JWT authorization dynamically
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('userInfo', JSON.stringify(data));
  return data;
};

export const registerUser = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  localStorage.setItem('userInfo', JSON.stringify(data));
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('userInfo');
};

export const fetchDocuments = async () => {
  const { data } = await api.get('/docs');
  return data;
};

export const uploadDocument = async (formData) => {
  const { data } = await api.post('/docs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const sendChatQuery = async (query) => {
  const { data } = await api.post('/chat', { query });
  return data;
};

export default api;
