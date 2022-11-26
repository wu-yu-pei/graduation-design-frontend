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
