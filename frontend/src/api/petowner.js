import request from '@/utils/request';

export function searchVacancy(data) {
  const { startdate, enddate, petcategory } = data;
  return request({
    url: '/petowner/search',
    method: 'post',
    params: { petcategory, startdate, enddate },
    data,
  });
}

export function searchInfo() {
  return {};
}
