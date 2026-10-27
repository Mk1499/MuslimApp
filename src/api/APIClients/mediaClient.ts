import axios from 'axios';

export const mediaClient = axios.create({
  // baseURL: 'http://192.168.1.102:3006/api/v1',
  baseURL: 'https://muslimserver.onrender.com/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
