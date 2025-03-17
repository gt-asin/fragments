// tests/unit/get-by-id.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('authorization test - fail', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('hello world');

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app).get(`/v1/fragments/${testFragment}`);

    expect(result.statusCode).toBe(401);
  });

  test('authorization test - success', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('hello world');

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('fragment that does not exist', async () => {
    const result = await request(app)
      .get(`/v1/fragments/abc123`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(404);
  });

  test('text/plain conversion to txt', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('hello world');

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}.txt`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('text/html conversion to txt', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('hello world');

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}.txt`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('markdown conversion to md', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('hello world');

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}.md`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('markdown conversion to html', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('hello world');

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}.html`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('markdown conversion to txt', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('hello world');

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}.txt`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('json conversion to json', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ message: 'hello world' }));

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}.json`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('json conversion to txt', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ message: 'hello world' }));

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}.txt`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });
});
