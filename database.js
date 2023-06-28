const { Pool } = require('pg');

const pool = new Pool({
  connectionString: '0.0.0.0',
  ssl: {
    rejectUnauthorized: false,
  }
});

module.exports = pool;
