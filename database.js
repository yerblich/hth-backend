const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Rabeinu18!@0.0.0.0:5432/itribes_database",
  ssl: {
    rejectUnauthorized: false,
  }
});

module.exports = pool;
