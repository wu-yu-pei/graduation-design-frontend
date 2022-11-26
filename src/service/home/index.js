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
