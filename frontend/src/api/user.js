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

export function getUserInfo() {
  const params = {};
  const data = {};
  return request({
    url: '/user/user',
    method: 'get',
    params,
    data,
  });
}

export function updateUserInfo({ address, phone, realname }) {
  const params = {};
  return request({
    url: '/user/user',
    method: 'put',
    params,
    data: { address, phone, realname },
  });
}

export function addCard(data) {
  const {
    cardnumber, holdername, cvv, exp,
  } = data;
  const params = {};
  return request({
    url: '/user/cards',
    method: 'post',
    params,
    data: {
      cardnumber, cvv, exp,
    },
  });
}

export function deleteCard(cardnumber) {
  const data = {};
  return request({
    url: '/user/cards',
    method: 'delete',
    params: { cardnumber },
    data,
  });
}

export function getCards() {
  const params = {};
  const data = {};
  return request({
    url: '/user/cards',
    method: 'get',
    params,
    data,
  });
}
