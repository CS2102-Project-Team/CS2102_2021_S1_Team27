const Pool = require('pg').Pool;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.DATABASE_URL ? undefined : 'me',
  host: process.env.DATABASE_URL ? undefined : 'localhost',
  database: process.env.DATABASE_URL ? undefined : 'api',
  password: process.env.DATABASE_URL ? undefined : '1234',
  port: process.env.DATABASE_URL ? undefined : 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
}