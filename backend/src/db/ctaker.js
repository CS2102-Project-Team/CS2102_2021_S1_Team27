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


  
module.exports = {
  functions: {
    getUserByEmail,
    getUserByUsername,
    registerUser,
  },
};
  