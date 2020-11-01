import request from '@/utils/request';

export function getCareTakerInfo() {
  return request({
    url: '/caretaker',
    method: 'get',
  });
}

export function registerCareTaker(data) {
  const { realname } = data;
  return request({
    url: '/caretaker',
    method: 'post',
    data: { realname },
  });
}

export function getCareTakerOrders(pastorderRequired) {
  const params = { pastorder: pastorderRequired };
  return request({
    url: '/caretaker/orders',
    method: 'get',
    params,
  });
}

export function updateCareTakerOrdersPayment(data) {
  const {
    startdate, enddate, ownerusername, petname,
  } = data;
  const params = { received: true };
  return request({
    url: '/caretaker/orders/payment',
    method: 'put',
    params,
    data: {
      startdate, enddate, ownerusername, petname,
    },
  });
}
// TODO Check if it is correct
export function getCareTakerStats() {
  const params = { petday: true, salary: true };
  return request({
    url: '/caretaker/stats',
    method: 'get',
    params,
  });
}

// Part-time care taker operation
export function acceptOrder(data) {
  const { accept } = data;
  const params = {};
  params.accept = accept;
  const {
    startdate, enddate, ownerusername, petname,
  } = data;
  return request({
    url: '/caretaker/orders',
    method: 'post',
    params,
    data: {
      startdate, enddate, ownerusername, petname,
    },
  });
}

export function addCareTakerPetCategory(data) {
  const {
    pettype, price,
  } = data;
  return request({
    url: '/caretaker/petcategory',
    method: 'post',
    data: {
      pettype, price,
    },
  });
}

export function updateCareTakerPetCategory(data) {
  const {
    pettype, price,
  } = data;
  return request({
    url: '/caretaker/petcategory',
    method: 'put',
    data: {
      pettype, price,
    },
  });
}

export function deleteCareTakerPetCategory(data) {
  const {
    pettype,
  } = data;
  return request({
    url: '/caretaker/petcategory',
    method: 'delete',
    params: { pettype },
  });
}

export function getCareTakerAvaliablity() {
  return request({
    url: '/caretaker/availability',
    method: 'get',
  });
}

export function updateCareTakerAvaliablity(data) {
  const { startdate, enddate } = data;
  return request({
    url: '/caretaker/availability-d-d',
    method: 'post',
    data: [{ startdate, enddate }],
  });
}

// Full Time Care Taker Operation
export function getCareTakerLeaves() {
  return request({
    url: '/caretaker/leaves',
    method: 'get',
  });
}

export function updateCareTakerLeaves(data) {
  const { startdate, enddate } = data;
  return request({
    url: '/caretaker/leaves',
    method: 'put',
    data: { startdate, enddate },
  });
}
