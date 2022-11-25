import axios from 'axios';

class Request {
  constructor(config) {
    this.instance = axios.create(config);
    this.instance.interceptors.request.use(
      config.interceptors.interceptorsRequest,
      config.interceptors.InterceptorsRequestCatch
    );
    this.instance.interceptors.response.use(
      config.interceptors.interceptorsResponse,
      config.interceptors.InterceptorsResponseCatch
    );
  }

  request(config) {
    return new Promise((resolve, reject) => {
      // 请求拦截器
      if (config?.interceptors?.interceptorsRequest && config?.interceptors?.InterceptorsRequestCatch) {
        this.instance.interceptors.request.use(
          config.interceptors.interceptorsRequest,
          config.interceptors.InterceptorsRequestCatch
        );
      }
      // 响应拦截器
      if (config?.interceptors?.interceptorsResponse && config?.interceptors?.interceptorsResponse) {
        this.instance.interceptors.response.use(
          config.interceptors.interceptorsResponse,
          config.interceptors.InterceptorsResponseCatch
        );
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
}

const BaseConfig = {
  baseURL: import.meta.env.VITE_BUSE_URL,
  timeout: 10000,
  interceptors: {
    // 请求拦截器
    interceptorsRequest(config) {
      return config;
    },
    interceptorsRequestCatch() {},
    // 响应拦截器
    interceptorsResponse(res) {
      return res;
    },
    interceptorsResponseCatch() {},
  },
};

const request = new Request(BaseConfig);

export default request;
