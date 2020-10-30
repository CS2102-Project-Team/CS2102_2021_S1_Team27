import request from '@/utils/request'

export function getService(data) {
  const { month, category, service } = data
  return request({
    url: '/admin/revenue',
    method: 'get',
    params: { month, category, pethour }
  })
}
