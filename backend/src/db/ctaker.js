const db = require('./index');

async function getCaretaker(username) {
  const { rows } = await db.query('SELECT fulltime, (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating FROM caretakers WHERE username = $1', [username]);
  return rows;
}

async function insertCaretaker(username) {
  const { rows } = await db.query('INSERT INTO caretakers(username, fulltime, maxpets) VALUES ($1, false, 2)', [username]);
  return rows;
}

async function getCategory(username) {
  const { rows } = await db.query('SELECT ptype, price FROM looksafter WHERE ctaker=$1', [username]);
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

async function getPetday(username) {
  const { rows } = await db.query('SELECT SUM(edate - sdate + 1) FROM orders WHERE ctaker=$1 AND EXTRACT(MONTH FROM sdate) = EXTRACT(MONTH FROM current_timestamp)', [username]);
  return rows;
}

async function getSalary(username) {
  const { rows } = await db.query('SELECT SUM(edate - sdate + 1) FROM orders WHERE ctaker=$1 AND EXTRACT(MONTH FROM sdate) = EXTRACT(MONTH FROM current_timestamp)', [username]);
  return rows;
}

module.exports = {
  functions: {
    getCaretaker,
    insertCaretaker,
    getCategory,
    insertCategory,
    updatePrice,
    deleteCategory,
    getOrders,
    getPetday,
    getSalary,
  },
};
