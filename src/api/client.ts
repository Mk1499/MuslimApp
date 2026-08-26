import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://ummahapi.com/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
