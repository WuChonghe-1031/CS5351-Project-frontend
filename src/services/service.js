import axios from 'axios';

const service = axios.create({
  baseURL: 'http://localhost:8080',
  // baseURL: 'http://114.132.122.217:8080',
  timeout: 10000,  // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    config.headers['Access-Control-Allow-Origin'] = '*';
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