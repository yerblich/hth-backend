const fastify = require('./app');
const pool = require('./database');

const start = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to the database');
    client.release();

    await fastify.listen(3000);
    console.log('Server is running on port 3000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
