import request from '@/utils/request'

export function getRevenue(data) {
  const { year } = data
  return request({
    url: '/admin/revenue',
    method: 'get',
    params: { year }
  })
}
