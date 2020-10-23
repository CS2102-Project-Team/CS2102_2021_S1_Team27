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
        avatar: 'https://avatars1.githubusercontent.com/u/34601854?s=400&u=ff0de9a0d4df47ed8d4ff46076f8c4645a94dbbe&v=4',
        name: 'Admin'
      }
    })
  })
}
