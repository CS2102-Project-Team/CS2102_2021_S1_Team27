const db = require('./index');

async function getCaretaker(username) {
  const { rows } = await db.query('SELECT fulltime, (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating FROM caretakers WHERE username = $1', [username]);
  return rows;
}

async function getReviews(username) {
  const { rows } = await db.query('SELECT ptype petcategory,rating, review FROM orders WHERE ctaker=$1 AND rating IS NOT NULL', [username]);
  return rows;
}

async function insertCaretaker(username, realname) {
  await db.query('UPDATE accounts SET realname=$2 WHERE username=$1', [username, realname]);
  const { rows } = await db.query('INSERT INTO caretakers(username, fulltime, maxpets) VALUES ($1, false, 2)', [username]);
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
  const { rows } = await db.query('SELECT SUM(earlier_date(edate, end_of_month(now()::DATE)) - later_date(sdate, start_of_month(now()::DATE)) + 1) FROM orders WHERE ctaker=$1 AND EXTRACT(MONTH FROM sdate) <= EXTRACT(MONTH FROM current_timestamp) AND EXTRACT(MONTH FROM edate) >= EXTRACT(MONTH FROM current_timestamp)', [username]);
  return rows;
}

/* Unfinished */
async function getSalary(username) {
  const { rows } = await db.query('SELECT SUM(edate - sdate + 1) FROM orders WHERE ctaker=$1 AND EXTRACT(MONTH FROM sdate) = EXTRACT(MONTH FROM current_timestamp)', [username]);
  return rows;
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

// if rating is not null, the service has completed
async function getReview(cname) {
  const { rows } = await db.query('SELECT ptype AS petcategory, rating, review FROM orders WHERE ctaker = $1 AND rating <> null', [cname]);
  return rows;
}

async function addAvailabilityDup(username, startDate, endDate) {
  const { rows } = await db.query('INSERT INTO available(ctaker, date, status) SELECT $1, dd::date, \'available\' FROM generate_series($2::timestamp, $3::timestamp, \'1 day\'::interval) dd ON CONFLICT DO NOTHING', [username, startDate, endDate]);
  return rows;
}

module.exports = {
  functions: {
    getCaretaker,
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
    checkFull,
    acceptRejectBid,
    getAvailability,
    addAvailability,
    getReview,
    updateOrder,
    addAvailabilityDup,
    addLeave,
  },
};
