const pool = require('pg').Pool;
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: '1234',
  port: 5432,
})

async function getUserByEmail(email) {
  return null;
}

async function getUserByUsername(username) {
  return null;
}

async function registerUser(username, email, password) {
  const I = 5;
  return I < 3 // U
    ? { success: true }
    : { success: false, error: 'Nah' };
}

async function pushAccessToken(token) {
  return null;
}

async function checkAccessToken(token) {
  return null;
}

async function removeAccessToken(token) {
  return null;
}

async function changePassword(email, password) {
  return null;
}

async function insertCard(cardnum, cvv, exp, username) {
  pool.query('INSERT INTO cards(cardnumber, CVV, expdate, username) VALUES ($1, $2, $3, $4)', [])
    .then(results => {return 'success';})
    .catch(error => {return 'Error:' + string(error);})
}

module.exports = {
  functions: {
    getUserByEmail,
    getUserByUsername,
    registerUser,
    pushAccessToken,
    checkAccessToken,
    removeAccessToken,
    changePassword,
    insertCard
  },
};
