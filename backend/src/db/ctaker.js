const db = require('./index');

async function getCaretaker(username) {
  const { rows } = await db.query('SELECT fulltime, (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating FROM caretakers WHERE username = $1', [username]);
  return rows;
}

async function insertCaretaker(username) {
  const { rows } = await db.query('INSERT INTO caretakers(username, fulltime, maxpets) VALUES ($1, false, 2)', [username]);
  return rows;
}

async function insertCategory(username, pettype, price) {
  const { rows } = await db.query('INSERT INTO looksafter(ctaker, ptype, price) VALUES ($1, $2, $3)', [username, pettype, price]);
  return rows;
}

async function updatePrice(username, pettype, price) {
  const { rows } = await db.query('UPDATE looksafter SET price=$3 WHERE ctaker=$1 AND ptype=$2', [username, pettype, price]);
  return rows;
}

async function deleteCategory(username, pettype) {
  const { rows } = await db.query('DELETE FROM looksafter WHERE ctaker=$1 AND ptype=$2', [username, pettype]);
  return rows;
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
    getCaretaker,
    insertCaretaker,
    insertCategory,
    updatePrice,
    deleteCategory,
    registerUser,
  },
};
