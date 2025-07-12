import axios from 'axios';

const API_URL = 'http://localhost:8000/clients/';

export const getClients = () => axios.get(API_URL);
export const getClient = (id) => axios.get(`${API_URL}${id}`);
export const createClient = (data) => axios.post(API_URL, data);
export const deleteClient = (id) => axios.delete(`${API_URL}${id}`);
export const updateClient = (id, data) => axios.put(`${API_URL}${id}`, data);