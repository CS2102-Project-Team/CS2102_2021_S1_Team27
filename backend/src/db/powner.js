const { rows } = require('pg/lib/defaults');
const db = require('./index');

async function getUserByEmail(email) {
  const { rows } = await db.query('SELECT * FROM accounts WHERE email = $1', [email]);
  return rows[0];
}

async function getPets(username) {
  const { rows } = await db.query('SELECT pname, ptype, remark FROM pets WHERE powner = $1', [username]);
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
  const { rows } = await db.query('SELECT ctaker, price FROM services WHERE sdate >= $2 AND edate <= $3 AND ptype = $1', [petcategory, startdate, enddate]);
  return rows;
}



async function insertBid(powner, pname, ctaker, ptype, startdate, enddate, paymentmethod, deliverymode) {
  const time = Date.now() / 1000;
  const bidstatus = 'bid';
  console.log(bidstatus);
  const { rows } = await db.query('INSERT INTO orders(powner, pname, ctaker, ptype, sdate, edate, delivery, payment, status) VALUES ($2, $3, $4, $5, $6, $7, $8, $9, $10)', 
    [time, powner, pname, ctaker, ptype, startdate, enddate, deliverymode, paymentmethod, bidstatus]);
  console.log("tracking debugging");
  return rows;
}


async function getBid(username, startdate, enddate) {
  const { rows } = await db.query('SELECT pname, ctaker, ptype, sdate, edate, delivery, payment, status FROM orders WHERE powner = $1 AND sdate >= $2 AND edate <= $3', [username, startdate, enddate]);
  return rows;
}

async function deleteBid(bidid) {
  const { rows } = await db.query('DELETE FROM orders WHERE id = $1', [bidid]);
  return rows;
}


module.exports = {
  functions: {
    getUserByEmail,
    getPets,
    insertPet,
    changePet,
    deletePet,
    getService,
    insertBid,
    getBid,
    deleteBid,
  },
};
