import request from '@/utils/request';

export function login(data) {
  const params = {};
  const { username, password } = data;
  const email = username;
  params.by = data.username.includes('@') ? 'email' : 'username';
  return request({
    url: '/auth/user/login',
    method: 'post',
    params,
    data: { username, email, password },
  });
}

export function getInfo() {
  return {};
}
