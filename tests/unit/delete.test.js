// tests/unit/delete.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  test('Unauthenticated request', async () => {
    const res = await request(app).delete('/v1/fragments/fakeid');
    expect(res.statusCode).toBe(401);
  });

  test('incorrect credentials are denied', async () => {
    const res = await request(app).delete('/v1/fragments/id').auth('fake@123.com', '1234567');
    expect(res.statusCode).toBe(401);
  });

  test('Successful delete request', async () => {
    const post_response = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is a fragment');

    const fragment = post_response.body.fragments.id;

    const res = await request(app)
      .delete(`/v1/fragments/${fragment}`)
      .auth('user1@email.com', 'password1');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('Deleting a fragment that doesnt exist', async () => {
    const res = await request(app)
      .delete('/v1/fragments/fake')
      .auth('user1@email.com', 'password1');

    expect(res.status).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(404);
    expect(res.body.error.message).toBeDefined;
  });
});
