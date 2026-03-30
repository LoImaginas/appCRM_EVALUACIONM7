import axios from 'axios';

const api = axios.create({
  baseURL: 'https://reqres.in/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getUsers = () => api.get('/users?page=1');
export const createUser = (payload) => api.post('/users', payload);
export const login = (payload) => api.post('/login', payload);

export default api;
