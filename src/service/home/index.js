import request from '..';

export function hi(account, password) {
  return request.get({
    url: '/hi',
  });
}
