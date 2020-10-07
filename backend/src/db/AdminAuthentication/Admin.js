const db = require('../index');

async function getAdminByEmail(email) {
  const { rows } = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
  return rows[0];
}

async function getAdminByUsername(username) {
  const { rows } = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
  return rows[0];
}

/*
async function pushAccessToken(token) {
  const { rows } = await db.query('INSERT INTO tokens(token) VALUES ($1)', [token]);
  return rows;
}

async function checkAccessToken(token) {
  const { rows } = await db.query('SELECT * FROM tokens WHERE token=$1', [token]);
  if (rows === null) {
    return false;
  }
  return true;
}

async function removeAccessToken(token) {
  const { rows } = await db.query('DELETE FROM tokens WHERE token = $1', [token]);
  return rows;
}
*/

async function changePassword(email, password) {
  const { rows } = await db.query('UPDATE admins SET passwd = $2 WHERE email = $1', [email, password]);
  return rows;
}

module.exports = {
  functions: {
    getAdminByEmail,
    getAdminByUsername,
    changePassword,
  },
};
