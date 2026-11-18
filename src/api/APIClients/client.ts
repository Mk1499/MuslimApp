import { EVENTS } from '@/hooks/useAnalytics';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://ummahapi.com/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle errors globally
    console.warn('API Error:', error);
    logEvent(getAnalytics(), EVENTS.General_API_ERROR, {
      error: error.message,
    });

    return Promise.reject(error);
  },
);
