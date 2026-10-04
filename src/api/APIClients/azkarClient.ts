import axios from 'axios';

export const azkarClient = axios.create({
  baseURL: 'https://www.hisnmuslim.com/api/ar',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
