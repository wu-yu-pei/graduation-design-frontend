import axios from 'axios';
import { router } from '../main';
class Request {
  constructor(config) {
    this.instance = axios.create(config);
    this.instance.interceptors.request.use(config.interceptors.interceptorsRequest, config.interceptors.InterceptorsRequestCatch);
    this.instance.interceptors.response.use(config.interceptors.interceptorsResponse, config.interceptors.InterceptorsResponseCatch);
  }

  request(config) {
    return new Promise((resolve, reject) => {
      // 请求拦截器
      if (config?.interceptors?.interceptorsRequest && config?.interceptors?.InterceptorsRequestCatch) {
        this.instance.interceptors.request.use(config.interceptors.interceptorsRequest, config.interceptors.InterceptorsRequestCatch);
      }
      // 响应拦截器
      if (config?.interceptors?.interceptorsResponse && config?.interceptors?.interceptorsResponse) {
        this.instance.interceptors.response.use(config.interceptors.interceptorsResponse, config.interceptors.InterceptorsResponseCatch);
      }
      this.instance
        .request(config)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get(config) {
    return this.request({ ...config, method: 'GET' });
  }

  post(config) {
    return this.request({ ...config, method: 'POST' });
  }

  delete(config) {
    return this.request({ ...config, method: 'DELETE' });
  }
}

const BaseConfig = {
  baseURL: import.meta.env.VITE_BUSE_URL,
  timeout: 100000000000,
  interceptors: {
    // 请求拦截器
    interceptorsRequest(config) {
      const token = localStorage.getItem('token');
      token && (config.headers.Authorization = `Bearer ${token}`);
      return config;
    },
    interceptorsRequestCatch() {},
    // 响应拦截器
    interceptorsResponse(res) {
      if (res.data.code == 401) {
        localStorage.setItem('token', '');
        localStorage.setItem('userInfo', '');
        return router.replace('/login');
      }
      return res;
    },
    interceptorsResponseCatch() {},
  },
};

const request = new Request(BaseConfig);

export default request;
