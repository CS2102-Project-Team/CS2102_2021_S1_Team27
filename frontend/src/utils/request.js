import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from './auth';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || 'https://pet-anything.herokuapp.com/api/v1',
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${getToken()}`;
    }
    return config;
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.log(`request error: ${error}`);
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // eslint-disable-next-line no-console
    if (res.status !== 200 || res.status !== 204) {
      Message({
        message: res.error || 'Error',
        type: 'error',
        duration: 5 * 1000,
      });
    }
    // Check for http status code and show error accordingly (e.g. 403-> logged out)
    return res;
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.log(`request error: ${error}`);
    Message({
      message: error.message || 'Error',
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);

export default service;
