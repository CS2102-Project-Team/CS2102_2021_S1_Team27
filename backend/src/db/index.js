const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.DATABASE_URL ? undefined : 'me',
  host: process.env.DATABASE_URL ? undefined : 'localhost',
  database: process.env.DATABASE_URL ? undefined : 'api',
  password: process.env.DATABASE_URL ? undefined : '1234',
  port: process.env.DATABASE_URL ? undefined : 5433,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
