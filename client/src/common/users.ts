import axios from 'axios';
import { BACKEND_URL } from './api';

export const getUsers = () =>
  axios({
    url: `${BACKEND_URL}/users`,
    method: 'get',
    withCredentials: true,
  });
