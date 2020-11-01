const db = require('./index');

async function getAdminByEmail(email) {
  const { rows } = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
  return rows[0];
}

async function getAdminByUsername(username) {
  const { rows } = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
  return rows[0];
}

async function promotePartime(username) {
  const { rows } = await db.query('UPDATE caretakers SET fulltime=true WHERE username = $1', [username]);
  return rows;
}

async function insertAvailability(username, startdate, enddate) {
  const { rows } = await db.query('INSERT INTO available(ctaker, date) SELECT $1, dd::date FROM generate_series($2::timestamp, $3::timestamp, \'1 day\'::interval) dd ON CONFLICT DO NOTHING', [username, startdate, enddate]);
  return rows;
}

async function changePasswordByEmail(email, password) {
  const { rows } = await db.query('UPDATE admins SET passwd = $2 WHERE email = $1', [email, password]);
  return rows;
}

async function changePasswordByUsername(username, password) {
  const { rows } = await db.query('UPDATE admins SET passwd = $2 WHERE username = $1', [username, password]);
  return rows;
}

async function getFullTimePrices() {
  const { rows } = await db.query('SELECT ptype category, price1, price2, price3 FROM fulltime_price');
  return rows;
}

// insert or update
async function insertFullTimePrice(category, attribute, price) {
  const { rows } = await db.query('UPDATE fulltime_price SET price1=$3 WHERE ptype = $2', [attribute, category, price]);
  return rows;
}

async function getLeave() {
  const { rows } = await db.query('SELECT * FROM fulltime_price');
  return rows;
}

async function addLeave(username, startDate, endDate, status) {
  const { rows } = await db.query('UPDATE leave SET status = $4 WHERE ctaker = $1 AND startdate = $2 AND enddate = $3', [username, startDate, endDate, status]);
  return rows;
}

async function getAllCaretaker() {
  const { rows } = await db.query('SELECT username, (SELECT realname FROM accounts a WHERE a.username = username) AS name, fulltime, (SELECT addres FROM accounts a1 WHERE a1.username = username) AS address, (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating FROM caretakers');
  return rows;
}

async function getAllPetowners() {
  const { rows } = await db.query('SELECT powner AS username, (SELECT COUNT(*) FROM orders a WHERE a.powner = powner) AS deal, (SELECT SUM(a2.price) FROM orders a2 WHERE a2.powner = powner) FROM orders');
  return rows;
}

module.exports = {
  functions: {
    getAdminByEmail,
    getAdminByUsername,
    promotePartime,
    insertAvailability,
    changePasswordByEmail,
    changePasswordByUsername,
    getFullTimePrices,
    insertFullTimePrice,
    getLeave,
    addLeave,
    getAllCaretaker,
    getAllPetowners,
  },
};
