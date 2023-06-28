const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://themainguy:qjaTCSBsraPKLNsyC7rnaYRJJGvcxyBE@dpg-cie7nft9aq0ce3bbjhgg-a/itribes_database_ur70",
  ssl: {
    rejectUnauthorized: false,
  }
});

module.exports = pool;
