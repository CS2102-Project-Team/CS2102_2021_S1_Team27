const db = require('./index')

async function getUserByEmail(email) {
  return null;
}

async function getUserByUsername(username) {
  return null;
}

async function registerUser(username, email, password) {
  const {rows} = await db.query('INSERT INTO accounts(username, passwd, email) VALUES ($1, $2, $3)', [username, password, email]);
  return {success: true};
  /*
  return I < 3 // U
    ? { success: true }
    : { success: false, error: 'Nah' };
  */
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
  const {rows} = await db.query('INSERT INTO cards(cardnumber, CVV, expdate, username) VALUES ($1, $2, $3, $4)', [cardnum, cvv, exp, username]);
  return { success: true };
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
