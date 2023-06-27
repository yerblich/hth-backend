// login.test.js
const bcrypt = require('bcrypt');
const fastify = require('../app'); // import the fastify instance you are exporting in your code

jest.mock('../database', () => ({
  connect: jest.fn().mockResolvedValue({
    query: jest.fn().mockResolvedValue({
      rows: [
        {
          hashed_password: '$2b$10$Dy6WmU/n.GnYRbfnh4ginOS/bd1qhZ8/9AQ.gZzok12RjyfHMJfGS', // bcrypt.hashSync('password', 10)
        },
      ],
    }),
    release: jest.fn(),
  }),
}));

jest.mock('bcrypt');

describe('login', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 200 and a success message when the correct password is provided', async () => {
    bcrypt.compare.mockResolvedValue(true); // mock bcrypt.compare to always return true

    const response = await fastify.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'test@example.com',
        password: 'password',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      message: 'User authenticated successfully!',
    });
  });

  it('should return 401 and an error message when an incorrect password is provided', async () => {
    bcrypt.compare.mockResolvedValue(false); // mock bcrypt.compare to always return false

    const response = await fastify.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'test@example.com',
        password: 'wrong_password',
      },
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Incorrect password.',
    });
  });
});
