const db = require('./index');

async function getUserByEmail(email) {
  const { rows } = await db.query('SELECT * FROM accounts WHERE email = $1', [email]);
  return rows[0];
}

async function getPets(username) {
  const { rows } = await db.query('SELECT pname, ptype, remark FROM pets WHERE powner = $1', [username]);
  return rows;
}

async function getThePet(username, petname) {
  const { rows } = await db.query('SELECT ptype FROM pets WHERE powner = $1 AND pname = $2', [username, petname]);
  return rows;
}

async function insertPet(username, petname, pettype, remark) {
  const { rows } = await db.query('INSERT INTO pets(powner, pname, ptype, remark) VALUES ($1, $2, $3, $4)', [username, petname, pettype, remark]);
  return rows;
}

async function changePet(username, petname, pettype, remark) {
  const { rows } = await db.query('UPDATE pets SET ptype = $3, remark = $4 WHERE powner = $1 AND pname = $2', [username, petname, pettype, remark]);
  return rows;
}

async function deletePet(username, petname) {
  const { rows } = await db.query('DELETE FROM pets WHERE powner = $1 AND pname = $2', [username, petname]);
  return rows;
}

async function getService(petcategory, startdate, enddate) {
  const { rows } = await db.query('SELECT username, realname, addres, fulltime, (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating, price * ($3::DATE - $2::DATE + 1) AS totalprice FROM (caretakers C JOIN looksafter ON ctaker=C.username AND ptype=$1) NATURAL JOIN accounts WHERE ($3::DATE-$2::DATE+1) = (SELECT COUNT(*) FROM available A WHERE A.ctaker=C.username AND date>=$2 AND date<=$3 AND status=\'available\')', [petcategory, startdate, enddate]);
  return rows;
}
// just a little unsure -> is the address ctaker's or user's

async function insertBid(
  powner, pname, ctaker, ptype, startdate, enddate, paymentmethod, deliverymode, remark,
) {
  const bidstatus = 'Pending Caretaker Acceptance';
  const p = await db.query('SELECT price * ($4::DATE - $3::DATE + 1) AS totalprice FROM looksafter WHERE ctaker=$1 AND ptype=$2', [ctaker, ptype, startdate, enddate]);
  const price = p.rows[0].totalprice;
  const { rows } = await db.query('INSERT INTO orders(bidtime, powner, pname, ctaker, ptype, sdate, edate, delivery, payment, status, remark, price) VALUES (current_timestamp, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    // eslint-disable-next-line max-len
    [powner, pname, ctaker, ptype, startdate, enddate, deliverymode, paymentmethod, bidstatus, remark, price]);
  return rows;
}

async function getBidExceptStatus(username, status) {
  const { rows } = await db.query('SELECT powner, pname, ptype, ctaker, sdate, edate, payment, delivery, (SELECT price FROM services S WHERE S.ctaker = ctaker AND S.ptype = ptype AND S.sdate = sdate AND S.edate = edate), status, (SELECT rating FROM caretakers WHERE username = $1), review FROM orders WHERE powner = $1 AND status <> $2', [username, status]);
  return rows;
}

async function getAllBids(username) {
  const { rows } = await db.query('SELECT powner, pname, ptype, ctaker, sdate, edate, payment, delivery, price, status, rating, review FROM orders WHERE powner = $1', [username]);

  return rows;
}

async function deleteBid(bidid) {
  const { rows } = await db.query('DELETE FROM orders WHERE id = $1', [bidid]);
  return rows;
}

async function changeBid(username, petname, caretakerusername,
  startdate, enddate, rating, feedback) {
  const { rows } = await db.query('UPDATE orders SET rating = $6, review = $7 WHERE powner = $1 AND pname = $2 AND ctaker = $3 AND sdate = $4 AND edate = $5', [username, petname, caretakerusername,
    startdate, enddate, rating, feedback]);
  return rows;
}

async function payOrder(username, petname, caretakerusername,
  startdate, enddate) {
  const { rows } = await db.query('UPDATE orders SET status = \'Payment Received\' WHERE powner = $1 AND pname = $2 AND ctaker = $3 AND sdate = $4 AND edate = $5', [username, petname, caretakerusername,
    startdate, enddate]);
  return rows;
}

module.exports = {
  functions: {
    getUserByEmail,
    getPets,
    getThePet,
    insertPet,
    changePet,
    deletePet,
    getService,
    insertBid,
    getBidExceptStatus,
    getAllBids,
    deleteBid,
    changeBid,
    payOrder,
  },
};
