const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  test('Unauthenticated request', async () => {
    const res = await request(app).put('/v1/fragments/id');
    expect(res.statusCode).toBe(401);
  });

  test('Post request', async () => {
    const post_response = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('Hello World');

    const fragment = post_response.body.fragments.id;

    const put_response = await request(app)
      .put(`/v1/fragments/${fragment}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('new text');

    expect(put_response.statusCode).toBe(200);
    expect(JSON.parse(put_response.text).status).toBe('ok');
  });

  test('A fragment cannot be updated when requested content type is different', async () => {
    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is a fragment');

    const createdFragmentId = postResponse.body.fragments.id;

    const res = await request(app)
      .put(`/v1/fragments/${createdFragmentId}`)
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/md')
      .send('This is a much much longer fragment');

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });

  test('A non-existent fragment cannot be updated', async () => {
    const res = await request(app)
      .put(`/v1/fragments/non-existent`)
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is a much much longer fragment');

    expect(res.status).toBe(404);
    expect(res.body.status).toBe('error');
  });
});
