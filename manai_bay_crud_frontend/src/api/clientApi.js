import axios from 'axios';

// Base URL for API requests
const BASE_URL =
  window.location.hostname === 'localhost'
    ? 'https://nn-ee-breakdown-cult.trycloudflare.com'
    : `https://nn-ee-breakdown-cult.trycloudflare.com`;

// Create an Axios instance with base URL
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
// Login user
api.postLogin = (data) => api.post('/login', data);
// Register user
api.postRegister = (data) => api.post('/register', data);

// Client endpoints
// Get all clients
api.getClients = () => api.get('/clients/');
// Get a single client by ID
api.getClient = (id) => api.get(`/clients/${id}`);
// Create a new client
api.createClient = (data) => api.post('/clients/', data);
// Delete a client by ID
api.deleteClient = (id) => api.delete(`/clients/${id}`);
// Update a client by ID
api.updateClient = (id, data) => api.put(`/clients/${id}`, data);

api.deleteUser = (id) => api.delete(`/users/${id}`);

export default api;