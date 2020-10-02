const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: '1234',
  port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
}