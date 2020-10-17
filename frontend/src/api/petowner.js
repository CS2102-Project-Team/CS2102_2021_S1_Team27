import request from '@/utils/request';

export function searchVacancy(data) {
  const { startdate, enddate, petcategory } = data;
  console.log(`Search for a slot for ${petcategory} between ${startdate} and ${enddate}`);
  return request({
    url: '/petowner/search',
    method: 'get',
    params: { petcategory, startdate, enddate },
    data,
  });
}

export function searchInfo() {
  return {};
}
