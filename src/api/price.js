import request from '@/utils/request'

export function getPrice() {
  return request({
    url: '/admin/price',
    method: 'get'
  })
}

export function putPrice(data) {
  const { category, classes, price } = data
  return request({
    url: '/admin/price',
    method: 'put',
    data: { category, classes, price }
  })
}
