const request = require('supertest');
const mongoose = require('mongoose');

let app;
let server;

beforeAll(() => {
  // Import both app and server from the server.js file
  const serverModule = require('../server');
  app = serverModule.app;
  server = serverModule.server;
});

afterAll(async (done) => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
  server.close();
});

describe('Auth API', () => {
  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should log in an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
