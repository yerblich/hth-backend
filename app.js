const fastify = require('fastify')();
const cors = require('@fastify/cors');
const csv = require('csv-parser');
const formBody = require('@fastify/formbody');
const pool = require('./database');

const port = process.env.PORT || 3000;
const host = ("RENDER" in process.env) ? `0.0.0.0` : null;

fastify.register(formBody);
fastify.register(cors, {
  origin: 'http://localhost:3001',
});

fastify.get('/importUsers', async (req, reply) => {
  const dataRows = [];
  fs.createReadStream('/users.csv')
    .pipe(csv())
    .on('data', (data) => dataRows.push(data))
    .on('end', () => {
      dataRows.forEach(row => {
        // Adjust this query to match your specific table and data structure
        pool.query('INSERT INTO users (id, firstname, lastname, username, gender, dateofbirth, village, community, city, state, country, membertype, email, createdat, updatedat, password, hashed_password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)', 
          [row.id, row.firstname, row.lastname, row.username, row.gender, row.dateofbirth, row.village, row.community, row.city, row.state, row.country, row.membertype, row.email, row.createdat, row.updatedat, row.password, row.hashed_password], 
          (error, results) => {
            if (error) {
              throw error;
            }
          });
      });
      reply.send({status: 'Import completed'});
    });
});

fastify.get('/importVillages', async (req, reply) => {
  const dataRows = [];
  fs.createReadStream('/villages.csv')
    .pipe(csv())
    .on('data', (data) => dataRows.push(data))
    .on('end', () => {
      dataRows.forEach(row => {
        pool.query('INSERT INTO villages (id, no, province, district, village_name, latitude, longitude, area_square_meter, hectares, shape_length, population) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', 
          [row.id, row.no, row.province, row.district, row.village_name, row.latitude, row.longitude, row.area_square_meter, row.hectares, row.shape_length, row.population], 
          (error, results) => {
            if (error) {
              throw error;
            }
          });
      });
      reply.send({status: 'Import completed'});
    });
});


fastify.get('/villages-info', async (request, reply) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM villages');
    const villages = result.rows;

    client.release();

    reply.code(200).send(villages);
  } catch (error) {
    console.error('Error fetching village data:', error);
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

fastify.post('/login', async (request, reply) => {
  try {
    const { email, password } = request.body;

    console.log('Request body:', request.body);  // log the request body

    const client = await pool.connect();

    const result = await client.query(`
      SELECT password FROM users WHERE email = $1
    `, [email]);

    console.log('Database response:', result.rows);  // log the database response

    if (result.rows.length === 0) {
      reply.status(401).send({ message: 'No user found with this email.' });
      return;
    }

    const storedPassword = result.rows[0].password;

    if (password !== storedPassword) {
      reply.status(401).send({ message: 'Incorrect password.' });
      return;
    }

    reply.send({ message: 'User authenticated successfully!', success: true });
  } catch (err) {
    console.error('Error occurred:', err);
    reply.status(500).send({ message: 'An error occurred', error: err.message });
  }
});


fastify.get('/users', async (request, reply) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    const users = result.rows;

    client.release();

    reply.code(200).send(users);
  } catch (error) {
    console.error('Error fetching user data:', error);
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

fastify.post('/register', async (request, reply) => {
  try {
    const {
      firstname,
      lastname,
      username,
      gender,
      dateofbirth,
      tribe,
      community,
      city,
      state,
      country,
      memberType,
      email,
      password // Add the password field here
    } = request.body;

    const client = await pool.connect();

    const result = await client.query(`
      INSERT INTO users (
        firstname,
        lastname,
        username,
        gender,
        dateofbirth,
        tribe,
        community,
        city,
        state,
        country,
        membertype,
        email,
        password -- Add the password field here
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      firstname,
      lastname,
      username,
      gender,
      dateofbirth,
      tribe,
      community,
      city,
      state,
      country,
      memberType,
      email,
      password // Pass the password as is
    ]);

    reply.send({ message: 'User registered successfully!', user: result.rows[0] });
  } catch (err) {
    console.error('Error occurred:', err);
    reply.status(500).send({ message: 'An error occurred', error: err.message });
  }
});

module.exports = fastify;
