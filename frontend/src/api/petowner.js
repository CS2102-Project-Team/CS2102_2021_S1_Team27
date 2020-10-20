import request from '@/utils/request';

export function searchVacancy(data) {
  const { startdate, enddate, petcategory } = data;
  return request({
    url: '/petowner/search',
    method: 'get',
    params: { petcategory, startdate, enddate },
    data,
  });
}

export function searchPets() {
  const params = {};
  const data = {};
  return request({
    url: '/petowner/pet',
    method: 'get',
    params,
    data,
  });
}
