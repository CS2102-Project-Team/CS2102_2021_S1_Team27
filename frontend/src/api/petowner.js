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
  console.log(data);
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
  const param = {};
  return request({
    url: '/petowner/pay',
    method: 'put',
    param,
    data: {
      petname, caretakerusername, startdate, enddate,
    },
  });
}

export function giveRating(data) {
  const param = {};
  const {
    petname, caretakerusername, startdate, enddate, rating, feedback,
  } = data;
  return request({
    url: '/petowner/order',
    method: 'put',
    param,
    data: {
      petname, caretakerusername, startdate, enddate, rating, feedback,
    },
  });
}

export function getCTReview(caretakerusername) {
  const data = {};
  return request({
    url: '/caretaker/reviews',
    method: 'get',
    param: { caretakerusername },
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
