import axios from 'axios';

const BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : `http://${window.location.hostname}:8000`;

const productApi = axios.create({
  baseURL: BASE_URL,
});

productApi.interceptors.request.use(config => {
  const token = window.localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

productApi.getProducts = () => productApi.get('/products/');
productApi.getProduct = (id) => productApi.get(`/products/${id}`);
productApi.createProduct = (data) => productApi.post('/products/', data);
productApi.updateProduct = (id, data) => productApi.put(`/products/${id}`, data);
productApi.deleteProduct = (id) => productApi.delete(`/products/${id}`);

export default productApi;
