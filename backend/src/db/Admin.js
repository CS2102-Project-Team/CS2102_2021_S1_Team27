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
  try {
    await db.query('BEGIN');
    const queryText = 'UPDATE caretakers SET fulltime=true, maxpets=5 WHERE username = $1';
    await db.query(queryText, [username]);
    const queryText2 = 'INSERT INTO looksafter(ctaker, price, ptype) SELECT $1, 0, ptype FROM pettypes';
    await db.query(queryText2, [username]);
    const queryText3 = 'SELECT update_price_f(ptype) FROM pettypes';
    await db.query(queryText3);
    const insertAvail = 'INSERT INTO available(ctaker, date) SELECT $1, dd::date FROM generate_series($2::timestamp, $3::timestamp, \'1 day\'::interval) dd ON CONFLICT DO NOTHING';
    await db.query(insertAvail, [username, '2020-10-01', '2021-12-31']);
    await db.query('COMMIT');
  } catch (err) {
    await db.query('ROLLBACK');
    throw err;
  }
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

// insert or update, a little strange bug needs debugging.
async function insertFullTimePrice1(category, price) {
  const { rows } = await db.query('UPDATE fulltime_price SET price1=$2 WHERE ptype = $1', [category, price]);
  await db.query('CALL update_price($1)', [category]);
  return rows;
}

async function insertFullTimePrice2(category, price) {
  const { rows } = await db.query('UPDATE fulltime_price SET price2=$2 WHERE ptype = $1', [category, price]);
  await db.query('CALL update_price($1)', [category]);
  return rows;
}

async function insertFullTimePrice3(category, price) {
  const { rows } = await db.query('UPDATE fulltime_price SET price3=$2 WHERE ptype = $1', [category, price]);
  await db.query('CALL update_price($1)', [category]);
  return rows;
}

// one thing to change -> clash is not stored.
async function getLeave() {
  const { rows } = await db.query('SELECT ctaker AS caretakerusername, startdate, enddate, clash, status FROM leave');
  return rows;
}

async function updateLeaveStatus(username, startDate, endDate, status) {
  const { rows } = await db.query('UPDATE leave SET status = $4 WHERE ctaker = $1 AND startdate = $2 AND enddate = $3', [username, startDate, endDate, status]);
  return rows;
}

async function getAllCaretaker() {
  const { rows } = await db.query('SELECT username, (SELECT realname FROM accounts a WHERE a.username = c.username) AS name, fulltime, (SELECT addres FROM accounts a1 WHERE a1.username = c.username) AS address, (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating FROM caretakers c');
  return rows;
}

async function getAllPetowners() {
  const { rows } = await db.query('SELECT DISTINCT powner AS username, (SELECT COUNT(*) FROM orders a WHERE a.powner = powner AND (a.status =\'Payment Received\' OR a.status=\'Pending Payment\')) AS deals, (SELECT SUM(a2.price) FROM orders a2 WHERE a2.powner = powner AND (a2.status =\'Payment Received\' OR a2.status=\'Pending Payment\')) AS spending FROM orders');
  return rows;
}

async function checkclash(username, startdate, enddate) {
  const { rows } = await db.query('SELECT check_clash($1, $2, $3)', [username, startdate, enddate]);
  return rows[0].check_clash;
}

async function getPetType() {
  const { rows } = await db.query('SELECT * FROM pettypes');
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
    insertFullTimePrice1,
    insertFullTimePrice2,
    insertFullTimePrice3,
    getLeave,
    updateLeaveStatus,
    getAllCaretaker,
    getAllPetowners,
    checkclash,
    getPetType,
  },
};
