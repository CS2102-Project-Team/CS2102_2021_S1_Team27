const db = require('./index');

async function getUserByEmail(email) {
  const { rows } = await db.query('SELECT * FROM accounts WHERE email = $1', [email]);
  return rows[0];
}

async function getUserByUsername(username) {
  const { rows } = await db.query('SELECT * FROM accounts WHERE username = $1', [username]);
  return rows[0];
}

async function registerUser(username, email, password) {
  const { rows } = await db.query('INSERT INTO accounts(username, passwd, email) VALUES ($1, $2, $3)', [username, password, email]);
  return rows;
  /*
  return I < 3 // U
    ? { success: true }
    : { success: false, error: 'Nah' };
  */
}

async function updateUser(username, phone, address, realname) {
  const { rows } = await db.query('UPDATE accounts SET phone = $2, addres = $3, realname = $4 WHERE username = $1', [username, phone, address, realname]);
  return rows;
  /*
  return I < 3 // U
    ? { success: true }
    : { success: false, error: 'Nah' };
  */
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
  const { rows } = await db.query('UPDATE accounts SET passwd = $2 WHERE email = $1', [email, password]);
  return rows;
}

async function getCards(username) {
  const { rows } = await db.query('SELECT cardnumber FROM cards WHERE username = $1', [username]);
  return rows;
}

async function insertCard(cardnum, cvv, exp, username) {
  const { rows } = await db.query('INSERT INTO cards(cardnumber, holdername, CVV, expdate, username) VALUES ($1, $4, $2, $3, $4)', [cardnum, cvv, exp, username]);
  return rows;
}
// TODO: as holdername in the card NOT NULL, thus we have to insert holdername here.
// I now user a dummy value: username, may need to change later.

async function deleteCard(cardnum) {
  // eslint-disable-next-line no-unused-vars
  const intcardnum = parseInt(cardnum, 10);
  // eslint-disable-next-line no-console
  console.log(cardnum);
  const { rows } = await db.query('DELETE FROM cards WHERE cardnumber = $1', [parseInt(cardnum, 10)]);
  return rows;
}

module.exports = {
  functions: {
    getUserByEmail,
    getUserByUsername,
    registerUser,
    updateUser,
    changePassword,
    getCards,
    insertCard,
    deleteCard,
  },
};
