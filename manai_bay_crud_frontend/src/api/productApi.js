import axios from 'axios';

const BASE_URL =
  window.location.hostname === 'localhost'
    ? 'https://nn-ee-breakdown-cult.trycloudflare.com'
    : `https://nn-ee-breakdown-cult.trycloudflare.com`;

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

productApi.getProducts = (searchTerm) => {
  const params = {};
  if (searchTerm) {
    params.search = searchTerm;
  }
  return productApi.get('/products/', { params });
};
productApi.getProduct = (id) => productApi.get(`/products/${id}`);
productApi.createProduct = (data) => productApi.post('/products/', data);
productApi.updateProduct = (id, data) => productApi.put(`/products/${id}`, data);
productApi.deleteProduct = (id) => productApi.delete(`/products/${id}`);

export default productApi;
