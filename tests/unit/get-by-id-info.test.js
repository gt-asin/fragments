const request = require('supertest');
const app = require('../../src/app');

describe('GET request for /v1/fragments/:id/info', () => {
  test(`unauthorized request`, async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('hello world');
    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app).get(`/v1/fragments/${testFragment}/info`);

    expect(result.statusCode).toBe(401);
  });

  test(`fake credentials`, async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('hello world');
    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}/info`)
      .auth('fake', 'pass');

    expect(result.statusCode).toBe(401);
  });

  test(`authorized request`, async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('hello world');
    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}/info`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test(`fake fragment`, async () => {
    const result = await request(app)
      .get(`/v1/fragments/123456/info`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(500);
  });
});
