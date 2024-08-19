const request = require('supertest');
const mongoose = require('mongoose');

let app;
let server;
let token;
let postId;

beforeAll(async () => {
  // Import both app and server from the server.js file
  const serverModule = require('../server');
  app = serverModule.app;
  server = serverModule.server;

  // Connect to test database
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Sign up and get a token
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
  token = res.body.token;
});

afterAll(async (done) => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
  server.close();
});

describe('Post API', () => {
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'This is a test post content.',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Test Post');
    postId = res.body._id; // Save the post ID for further tests
  });

  it('should retrieve all posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toEqual(200);
    expect(res.body.posts).toHaveLength(1);
  });

  it('should retrieve a single post by ID', async () => {
    const res = await request(app).get(`/api/posts/${postId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', postId);
  });

  it('should update a post', async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Test Post',
        content: 'This is updated test post content.',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Updated Test Post');
  });

  it('should delete a post', async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Post deleted');
  });
});
