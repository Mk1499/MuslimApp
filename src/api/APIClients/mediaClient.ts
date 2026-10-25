import axios from 'axios';

export const mediaClient = axios.create({
  baseURL: 'http://localhost:3006/api/v1',
  // baseURL: 'https://muslimserver.onrender.com/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
