import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach JWT token to requests if available
api.interceptors.request.use(config => {
  const token = window.localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
api.postLogin = (data) => api.post('/login', data);
api.postRegister = (data) => api.post('/register', data);

// Client endpoints
api.getClients = () => api.get('/clients/');
api.getClient = (id) => api.get(`/clients/${id}`);
api.createClient = (data) => api.post('/clients/', data);
api.deleteClient = (id) => api.delete(`/clients/${id}`);
api.updateClient = (id, data) => api.put(`/clients/${id}`, data);

export default api;