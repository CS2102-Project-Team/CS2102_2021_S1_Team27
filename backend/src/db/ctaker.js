const db = require('./index');

async function getCaretaker(username) {
  const { rows } = await db.query('SELECT fulltime, (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating FROM caretakers WHERE username = $1', [username]);
  return rows;
}

async function checkFulltime(username) {
  const { rows } = await db.query('SELECT fulltime FROM caretakers WHERE username = $1', [username]);
  return rows[0].fulltime;
}

async function getReviews(username) {
  const { rows } = await db.query('SELECT ptype petcategory,rating, review FROM orders WHERE ctaker=$1 AND rating IS NOT NULL', [username]);
  return rows;
}

async function insertCaretaker(username, realname) {
  await db.query('UPDATE accounts SET realname=$2 WHERE username=$1', [username, realname]);
  const { rows } = await db.query('INSERT INTO caretakers(username, fulltime, maxpets, apptime) VALUES ($1, false, 2, current_timestamp)', [username]);
  return rows;
}

async function getCategory(username) {
  const { rows } = await db.query('SELECT ptype pettype, price FROM looksafter WHERE ctaker=$1', [username]);
  return rows;
}

async function insertCategory(username, pettype, price) {
  const { rows } = await db.query('INSERT INTO looksafter(ctaker, ptype, price) VALUES ($1, $2, $3)', [username, pettype, price]);
  return rows;
}

async function updatePrice(username, pettype, price) {
  const { rows } = await db.query('UPDATE looksafter SET price=$3 WHERE ctaker=$1 AND ptype=$2', [username, pettype, price]);
  return rows;
}

async function deleteCategory(username, pettype) {
  const { rows } = await db.query('DELETE FROM looksafter WHERE ctaker=$1 AND ptype=$2', [username, pettype]);
  return rows;
}

async function getOrders(username) {
  const { rows } = await db.query('SELECT sdate startdate, edate enddate, remark specialrequirement, ptype petcategory, pname petname, powner ownerusername, status, delivery deliverymode, rating, review FROM orders WHERE ctaker=$1', [username]);
  return rows;
}

async function updateOrder(ownerusername, petname, startdate, enddate) {
  const { rows } = await db.query('UPDATE orders SET status = \'Payment Received\' WHERE powner=$1 AND pname=$2 AND sdate = $3 AND edate=$4', [ownerusername, petname, startdate, enddate]);
  return rows;
}

async function getPendingOrders(username) {
  const { rows } = await db.query('SELECT sdate startdate, edate enddate, remark specialrequirement, ptype petcategory, pname petname, powner ownerusername, status, delivery deliverymode FROM orders WHERE ctaker=$1 AND status=\'Pending Caretaker Acceptance\'', [username]);
  return rows;
}

async function getPetday(username) {
  const { rows } = await db.query('SELECT SUM(earlier_date(edate, end_of_month(now()::DATE)) - later_date(sdate, start_of_month(now()::DATE)) + 1) FROM orders WHERE ctaker=$1 AND EXTRACT(MONTH FROM sdate) <= EXTRACT(MONTH FROM current_timestamp) AND EXTRACT(MONTH FROM edate) >= EXTRACT(MONTH FROM current_timestamp) AND status =\'Payment Received\'', [username]);
  return rows[0].sum ? Number(rows[0].sum) : 0;
}

async function getPetdayMonth(username, month) {
  const monthtimestamp = `${month}-01`;
  const { rows } = await db.query('SELECT SUM(earlier_date(edate, end_of_month($2::DATE)) - later_date(sdate, start_of_month($2::DATE)) + 1) FROM orders WHERE ctaker=$1 AND EXTRACT(MONTH FROM sdate) <= EXTRACT(MONTH FROM $2::DATE) AND EXTRACT(MONTH FROM edate) >= EXTRACT(MONTH FROM $2::DATE) AND status =\'Payment Received\'', [username, monthtimestamp]);
  return rows[0].sum ? Number(rows[0].sum) : 0;
}

async function getPetdayByCat(month) {
  const monthtimestamp = `${month}-01`;
  const { rows } = await db.query('SELECT SUM(earlier_date(edate, end_of_month($1::DATE)) - later_date(sdate, start_of_month($1::DATE)) + 1) FROM orders WHERE ptype = \'cat\' AND EXTRACT(MONTH FROM sdate) <= EXTRACT(MONTH FROM $1::DATE) AND EXTRACT(MONTH FROM edate) >= EXTRACT(MONTH FROM $1::DATE) AND status =\'Payment Received\'', [monthtimestamp]);
  return rows[0].sum ? Number(rows[0].sum) : 0;
}

async function getPetdayByPet(type, month) {
  const monthtimestamp = `${month}-01`;
  const { rows } = await db.query('SELECT SUM(earlier_date(edate, end_of_month($1::DATE)) - later_date(sdate, start_of_month($1::DATE)) + 1) FROM orders WHERE ptype = $2 AND EXTRACT(MONTH FROM sdate) <= EXTRACT(MONTH FROM $1::DATE) AND EXTRACT(MONTH FROM edate) >= EXTRACT(MONTH FROM $1::DATE) AND status =\'Payment Received\'', [monthtimestamp, type]);
  return rows[0].sum ? Number(rows[0].sum) : 0;
}

async function getPetdayByDog(month) {
  const monthtimestamp = `${month}-01`;
  const { rows } = await db.query('SELECT SUM(earlier_date(edate, end_of_month($1::DATE)) - later_date(sdate, start_of_month($1::DATE)) + 1) FROM orders WHERE ptype = \'dog\' AND EXTRACT(MONTH FROM sdate) <= EXTRACT(MONTH FROM $1::DATE) AND EXTRACT(MONTH FROM edate) >= EXTRACT(MONTH FROM $1::DATE) AND status =\'Payment Received\'', [monthtimestamp]);
  return rows[0].sum ? Number(rows[0].sum) : 0;
}

async function getPetdayByFish(month) {
  const monthtimestamp = `${month}-01`;
  const { rows } = await db.query('SELECT SUM(earlier_date(edate, end_of_month($1::DATE)) - later_date(sdate, start_of_month($1::DATE)) + 1) FROM orders WHERE ptype = \'fish\' AND EXTRACT(MONTH FROM sdate) <= EXTRACT(MONTH FROM $1::DATE) AND EXTRACT(MONTH FROM edate) >= EXTRACT(MONTH FROM $1::DATE) AND status =\'Payment Received\'', [monthtimestamp]);
  return rows[0].sum ? Number(rows[0].sum) : 0;
}

async function getTotalOrderAmount(username) {
  const { rows } = await db.query('SELECT SUM(price * 1.0 / (edate-sdate+1) * (earlier_date(edate, end_of_month(now()::DATE)) - later_date(sdate, start_of_month(now()::DATE)) + 1)) FROM orders WHERE ctaker=$1 AND EXTRACT(MONTH FROM sdate) <= EXTRACT(MONTH FROM current_timestamp) AND EXTRACT(MONTH FROM edate) >= EXTRACT(MONTH FROM current_timestamp) AND status =\'Payment Received\'', [username]);
  return rows[0].sum ? Number(rows[0].sum) : 0;
}

async function getTotalOrderAmountMonth(username, month) {
  const monthtimestamp = `${month}-01`;
  const { rows } = await db.query('SELECT SUM(price * 1.0 / (edate-sdate+1) * (earlier_date(edate, end_of_month($2::DATE)) - later_date(sdate, start_of_month($2::DATE)) + 1)) FROM orders WHERE ctaker=$1 AND EXTRACT(MONTH FROM sdate) <= EXTRACT(MONTH FROM $2) AND EXTRACT(MONTH FROM edate) >= EXTRACT(MONTH FROM $2) AND status =\'Payment Received\'', [username, monthtimestamp]);
  return rows[0].sum ? Number(rows[0].sum) : 0;
}

async function getAllTotalOrderAmountMonth(month) {
  const monthtimestamp = `${month}-01`;
  const { rows } = await db.query('SELECT SUM(price * 1.0 / (edate-sdate+1) * (earlier_date(edate, end_of_month($1::DATE)) - later_date(sdate, start_of_month($1::DATE)) + 1)) FROM orders WHERE EXTRACT(MONTH FROM sdate) <= EXTRACT(MONTH FROM $1) AND EXTRACT(MONTH FROM edate) >= EXTRACT(MONTH FROM $1) AND status =\'Payment Received\'', [monthtimestamp]);
  return rows[0].sum ? Number(rows[0].sum) : 0;
}

async function getSalary(username, fulltime) {
  if (fulltime) {
    const coeff = 0.8;
    const petday = await getPetday(username);
    if (petday <= 60) {
      return 3000;
    }
    const totalAmount = await getTotalOrderAmount(username);
    return 3000 + coeff * (totalAmount / petday) * (petday - 60);
  }
  /* Part-time */
  const totalAmount = await getTotalOrderAmount(username);
  const coeff = 0.75;
  return coeff * totalAmount;

  // eslint-disable-next-line max-len
  /* const { rows } = await db.query('SELECT SUM(edate - sdate + 1) FROM orders WHERE ctaker=$1 AND EXTRACT(MONTH FROM sdate) = EXTRACT(MONTH FROM current_timestamp)', [username]);
  return rows; */
}

async function getSalaryMonth(username, fulltime, month) {
  if (fulltime) {
    const coeff = 0.8;
    const petday = await getPetdayMonth(username, month);
    if (petday <= 60) {
      return 3000;
    }
    const totalAmount = await getTotalOrderAmountMonth(username, month);
    return 3000 + coeff * (totalAmount / petday) * (petday - 60);
  }
  /* Part-time */
  const totalAmount = await getTotalOrderAmountMonth(username, month);
  const coeff = 0.75;
  return coeff * totalAmount;
}

async function checkFull(username, startdate, enddate) {
  const { rows } = await db.query('SELECT date FROM available WHERE ctaker=$1 AND date >= $2 AND date <= $3 AND status=\'full\'', [username, startdate, enddate]);
  return rows;
}

async function acceptRejectBid(username, startdate, enddate, ownerusername, petname, status) {
  const rows = await db.query('UPDATE orders SET status = $6 WHERE ctaker=$1 AND sdate=$2 AND edate=$3 AND powner=$4 AND pname=$5', [username, startdate, enddate, ownerusername, petname, status]);
  return rows;
}

async function getAvailability(username) {
  const { rows } = await db.query('SELECT date FROM available WHERE ctaker=$1', [username]);
  return rows;
}

async function addAvailability(username, startDate, endDate) {
  const { rows } = await db.query('INSERT INTO available(ctaker, date, status) SELECT $1, dd::date, \'available\' FROM generate_series($2::timestamp, $3::timestamp, \'1 day\'::interval) dd', [username, startDate, endDate]);
  return rows;
}

async function addLeave(username, startDate, endDate) {
  const { rows } = await db.query('CALL update_leave($1, $2, $3)', [username, startDate, endDate]);
  return rows;
}

async function getLeave(username) {
  const { rows } = await db.query('SELECT startdate, enddate, status FROM leave WHERE ctaker=$1', [username]);
  return rows;
}

// if rating is not null, the service has completed
async function getReview(cname) {
  const { rows } = await db.query('SELECT ptype AS petcategory, rating, review FROM orders WHERE ctaker = $1 AND rating IS NOT NULL', [cname]);
  return rows;
}

async function addAvailabilityDup(username, startDate, endDate) {
  const { rows } = await db.query('INSERT INTO available(ctaker, date, status) SELECT $1, dd::date, \'available\' FROM generate_series($2::timestamp, $3::timestamp, \'1 day\'::interval) dd ON CONFLICT DO NOTHING', [username, startDate, endDate]);
  return rows;
}

async function checkclash(username, startdate, enddate) {
  const { rows } = await db.query('SELECT check_clash($1, $2, $3)', [username, startdate, enddate]);
  return rows[0].check_clash;
}

module.exports = {
  functions: {
    getCaretaker,
    checkFulltime,
    getReviews,
    insertCaretaker,
    getCategory,
    insertCategory,
    updatePrice,
    deleteCategory,
    getOrders,
    getPendingOrders,
    getPetday,
    getSalary,
    getPetdayMonth,
    getSalaryMonth,
    getTotalOrderAmountMonth,
    checkFull,
    acceptRejectBid,
    getAvailability,
    addAvailability,
    getReview,
    updateOrder,
    addAvailabilityDup,
    addLeave,
    getLeave,
    checkclash,
    getPetdayByCat,
    getPetdayByFish,
    getPetdayByDog,
    getAllTotalOrderAmountMonth,
    getPetdayByPet,
  },
};
