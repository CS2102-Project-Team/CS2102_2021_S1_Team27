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

export function updatePet(data) {
  const params = {};
  const { name, remark } = data;
  return request({
    url: '/petowner/pet',
    method: 'put',
    params,
    data: { name, remark },
  });
}

export function addPet(data) {
  const params = {};
  const { name, remark, type } = data;
  return request({
    url: '/petowner/pet',
    method: 'post',
    params,
    data: { name, remark, type },
  });
}
