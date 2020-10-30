import request from '@/utils/request'

export function getLeave(data) {
  const { include_history } = data
  return request({
    url: '/admin/leave',
    method: 'get',
    params: { include_history }
  })
}

export function putLeave(data) {
  const { username, startdate, enddate, approve } = data
  return request({
    url: '/admin/leave',
    method: 'put',
    data: { username, startdate, enddate, approve }
  })
}
