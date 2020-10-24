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

module.exports = {
  functions: {
    getAdminByEmail,
    getAdminByUsername,
    promotePartime,
    insertAvailability,
    changePasswordByEmail,
    changePasswordByUsername,
  },
};
