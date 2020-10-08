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

module.exports = {
  functions: {
    getUserByEmail,
    getPets,
    insertPet,
    changePet,
    deletePet,
  },
};
