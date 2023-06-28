const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Rabeinu18!@localhost:5432/itribes_database",
  ssl: {
    rejectUnauthorized: false,
  }
});

module.exports = pool;
