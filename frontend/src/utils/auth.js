import Cookies from 'js-cookie';

const AccessTokenKey = 'AccessToken';

export function getToken() {
  return Cookies.get(AccessTokenKey);
}

export function setToken(token) {
  return Cookies.set(AccessTokenKey, token);
}

export function removeToken() {
  return Cookies.remove(AccessTokenKey);
}
