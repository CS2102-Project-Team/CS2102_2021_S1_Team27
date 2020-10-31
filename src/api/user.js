import request from '@/utils/request'

const mockUser = {
  roles: ['admin'],
  introduction: 'I am a super administrator',
  avatar: 'https://github.com/CS2102-Project-Team.png',
  name: 'GodErosion',
  email: 'admin@petanything.ml'
}

export function login(data) {
  const { username, password } = data
  return request({
    url: '/auth/admin/login',
    method: 'post',
    params: { by: 'username' },
    data: { username, password }
  })
}

export function getInfo() {
  return new Promise((resolve, reject) => {
    request({
      url: '/admin',
      method: 'get'
    }).then(response => {
      const { username, email } = response
      resolve({
        data: {
          roles: ['admin'],
          introduction: 'I am a super administrator',
          avatar: 'https://github.com/CS2102-Project-Team.png',
          name: username,
          email
        }
      })
    // eslint-disable-next-line handle-callback-err
    }).catch(error => {
      resolve({
        data: mockUser
      })
      // reject(error)
    })
  })
}
