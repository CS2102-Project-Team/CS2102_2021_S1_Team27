import request from '@/utils/request'

export function login(data) {
  const { username, password } = data
  const email = username
  return request({
    url: '/auth/admin/login',
    method: 'post',
    params: { by: username.includes('@') ? 'email' : 'username' },
    data: { username, email, password }
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
