import request from '@/utils/request';
// this page interact with the server

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
export function signup({
  username, email, password, otp,
}) {
  const params = {};
  return request({
    url: '/auth/user/register',
    method: 'post',
    params,
    data: {
      username, email, password, otp,
    },
  });
}
export function getotp({
  email,
}) {
  const params = {};
  return request({
    url: '/auth/getotp',
    method: 'post',
    params,
    data: {
      email,
    },
  });
}
export function getInfo() {
  return {};
}
