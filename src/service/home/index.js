import request from '..';

export function login({ account, password }) {
  return request.post({
    url: '/login',
    data: {
      account,
      password,
    },
  });
}

export function findShop(uid) {
  return request.get({
    url: '/shop',
    params: {
      uid,
    },
  });
}

export function createShop(data) {
  return request.post({
    interceptors: {
      interceptorsRequest(config) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      InterceptorsRequestCatch(err) {
        return err;
      },
    },
    url: '/createshop',
    data,
  });
}

export function getCommits() {
  return request.get({
    url: '/commits',
  });
}
