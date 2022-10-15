import axios from 'axios';
import { BACKEND_URL } from './api';

export const login = (email: string, password: string) =>
  axios({
    method: 'post',
    url: '/api/login',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      email,
      password,
    },
  });

export const logout = () =>
  axios({
    url: `${BACKEND_URL}/auth/logout`,
    method: 'post',
    withCredentials: true,
  });

export const me = (cookie?: string) =>
  axios({
    url: `${BACKEND_URL}/auth/me`,
    method: 'get',
    withCredentials: true,
    headers: {
      Cookie: cookie,
    },
  });
