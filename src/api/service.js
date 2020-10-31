import request from '@/utils/request'

export function getService() {
  return request({
    url: '/admin/revenue',
    method: 'get'
  })
}
