import axios, { AxiosError, AxiosRequestConfig } from 'axios';

interface RetryableAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('access_token') : null;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error?: { code?: string } }>) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig;
    const tokenExpired = error.response?.status === 401 && error.response?.data?.error?.code === 'TOKEN_EXPIRED';

    if (tokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('access_token', refreshResponse.data.data.accessToken);
        }
        return api(originalRequest);
      } catch (_refreshError) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('access_token');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
