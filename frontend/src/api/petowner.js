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

export function placeOrder(data) {
  const {
    caretakername, petname, startdate, enddate, paymentmethod, deliverymode,
  } = data;
  const params = {};
  return request({
    url: '/petowner/order',
    method: 'post',
    params,
    data: {
      caretakername, petname, startdate, enddate, paymentmethod, deliverymode,
    },
  });
}

export function searchOrder() {
  const data = {};
  return request({
    url: '/petowner/order',
    method: 'get',
    params: {
      include_history: true,
    },
    data,
  });
}

export function makePayment(data) {
  const {
    petname, caretakerusername, startdate, enddate,
  } = data;
  const params = {};
  return request({
    url: '/petowner/pay',
    method: 'put',
    params,
    data: {
      petname, caretakerusername, startdate, enddate,
    },
  });
}

export function giveRating(data) {
  const params = {};
  const {
    petname, caretakerusername, startdate, enddate, rating, feedback,
  } = data;
  return request({
    url: '/petowner/order',
    method: 'put',
    params,
    data: {
      petname, caretakerusername, startdate, enddate, rating, feedback,
    },
  });
}

export function getCTReview(caretakerusername) {
  const data = {};
  // eslint-disable-next-line no-console
  console.log('Requesting CT Review');
  // eslint-disable-next-line no-console
  console.log(caretakerusername);
  return request({
    url: '/caretaker/reviews',
    method: 'get',
    params: { caretakerusername },
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
  const { name, type, remark } = data;
  return request({
    url: '/petowner/pet',
    method: 'put',
    params,
    data: { name, type, remark },
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
