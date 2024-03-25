import axios, { AxiosInstance } from 'axios';
import { message } from 'antd';
import { getUser, clearUser } from '@utils/auth';
import logger from './logger';

const instance: AxiosInstance = axios.create({
  // baseURL: '127.0.0.1:3001/',
  timeout: 5000,
});

instance.interceptors.request.use(
  config => {
    const user = getUser();
    const token = user ? user.token : null;
    config.headers['Authorization'] = 'Bearer ' + token;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const curPath = window.location.pathname;
    if (/401/.exec(error.response?.status) && curPath !== '/login') {
      message.error('认证失败，请重新登陆。');
      clearUser();
      window.location.href = '/login';
    }

    // switch 单独处理各种消息
    message.error(error.response?.data.error);
    return Promise.reject(error);
  }
);

export const get = <ResponseType>(url: string, params?: any) => {
  return instance.get<ResponseType>(url, {
    params,
  });
};

export const post = <ResponseType>(url: string, data: any) => {
  return instance.post<ResponseType>(url, data);
};

export const put = <ResponseType>(url: string, data: any) => {
  return instance.put<ResponseType>(url, data);
};

export const del = <ResponseType>(url: string) => {
  return instance.delete<ResponseType>(url);
};
