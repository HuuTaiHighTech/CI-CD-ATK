import axios, { AxiosError, type AxiosResponse } from 'axios';
import { mutate } from 'swr';
import { API_URL, AUTH_KEY } from '~/config/env';

const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: { 'Accept-Language': 'VI' }
});

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url;
      if (status === 401 && url !== '/sign-in') {
        await mutate(AUTH_KEY, null, false);
      }
    }
    return Promise.reject(error);
  }
);

export default http;
