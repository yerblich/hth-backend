const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'itribes_database',
//   password: 'Rabeinu18!',
//   port: 5432,
// });

module.exports = pool;
