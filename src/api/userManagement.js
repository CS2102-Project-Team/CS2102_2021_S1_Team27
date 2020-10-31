import request from '@/utils/request'

export function getCaretakers() {
  return request({
    url: '/admin/caretakers',
    method: 'get'
  })
}

export function getPetowners() {
  return request({
    url: '/admin/petowners',
    method: 'get'
  })
}

export function promote(data) {
  const { caretaker } = data
  return request({
    url: '/admin/promote',
    method: 'post',
    data: { caretaker }
  })
}
