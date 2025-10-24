import axios from 'axios';

const service = axios.create({
  baseURL: '',  // 你的API地址
  timeout: 10000,  // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // config.headers['Authorization'] = '你的token';
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    console.log('err' + error);
    return Promise.reject(error);
  }
);

export default service;