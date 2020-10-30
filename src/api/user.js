import request from '@/utils/request'

export function login(data) {
  const { username, password } = data
  return request({
    url: '/auth/admin/login',
    method: 'post',
    params: { by: 'username' },
    data: { username, password }
  })
}

export function getInfo(token) {
  return new Promise((resolve) => {
    resolve({
      data: {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://github.com/CS2102-Project-Team.png',
        name: 'Admin'
      }
    })
  })
}
