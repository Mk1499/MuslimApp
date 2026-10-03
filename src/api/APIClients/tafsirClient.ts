import axios from 'axios';

export const tafseerClient = axios.create({
  baseURL: 'http://api.quran-tafseer.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
