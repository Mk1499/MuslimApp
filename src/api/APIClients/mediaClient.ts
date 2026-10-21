import axios from 'axios';

export const mediaClient = axios.create({
  baseURL: 'http://192.168.86.80:3006/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
