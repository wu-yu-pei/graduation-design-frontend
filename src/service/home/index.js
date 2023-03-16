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
  });
}

export function createShop(data) {
  return request.post({
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

export function changeUserInfo(data) {
  return request.post({
    url: '/change',
    data,
  });
}

export function deleteOneThing(id) {
  return request.delete({
    url: '/deleteOneThing',
    params: { id },
  });
}

export function changeOneThing(id, name, price, total) {
  return request.post({
    url: '/changeOneThing',
    data: { id, name, price, total },
  });
}
