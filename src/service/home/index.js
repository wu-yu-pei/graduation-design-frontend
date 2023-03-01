import request from '..';

export function login(data) {
  return request.post({
    url: '/login',
    data: data,
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

export function updateAddressApi(data) {
  return request.post({
    url: '/updateAddress',
    data,
  });
}

export function getInfoByid(id) {
  return request.post({
    url: '/getInfoById',
    data: {
      id,
    },
  });
}

export function removeById(id) {
  return request.get({
    url: '/delete',
    params: {
      id,
    },
  });
}

export function addATransportInfo(data) {
  return request.post({
    url: '/addATransportInfo',
    data,
  });
}

export function getTransportInfo(id) {
  return request.post({
    url: '/getTransportInfo',
    params: {
      id,
    },
  });
}

export function createThings(data) {
  return request.post({
    url: '/createThings',
    data,
  });
}

export function getAllThings(id) {
  return request.get({
    url: '/getAllThings',
    params: {
      uid: id,
    },
  });
}
