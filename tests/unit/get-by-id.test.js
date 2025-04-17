// tests/unit/get-by-id.test.js
const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const path = require('path');

describe('GET /v1/fragments/:id', () => {
  test('No Authorization GET Request', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('hello world');

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app).get(`/v1/fragments/${testFragment}`);

    expect(result.statusCode).toBe(401);
  });

  test('Successful GET request', async () => {
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

  test('Failed GET request', async () => {
    const result = await request(app)
      .get(`/v1/fragments/fake`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(404);
  });

  test('Text/plain to Text/plain', async () => {
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

  test('Text/html to Text/plain', async () => {
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

  test('Text/CSV to CSV', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/csv')
      .send('hello world');

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}.csv`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('Text/CSV to CSV', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/csv')
      .send('hello world');

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}.csv`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('Text/CSV to Text/Plain', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/csv')
      .send('hello world');

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}.txt`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('Text/CSV to JSON', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/csv')
      .send('hello,world');

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}.json`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('Text/Markdown to Text/Markdown', async () => {
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

  test('Text/Markdown to Text/html', async () => {
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

  test('Text/Markdown to Text/Plain', async () => {
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

  test('Text/Html to Text/html', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('hello world');

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}.html`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('Text/html to Text/plain', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('hello world');

    const testFragment = JSON.parse(res.text).fragments.id;
    const result = await request(app)
      .get(`/v1/fragments/${testFragment}.txt`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('JSON conversion to JSON', async () => {
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

  test('JSON conversion to Text/plain', async () => {
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

  // PNG Conversions
  test('Conversion: PNG to PNG', async () => {
    const imgPath = path.join(__dirname, '../asset', 'example.png');
    const data = fs.readFileSync(imgPath);

    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(data);

    const getResponse = await request(app)
      .get(`/v1/fragments/${postResponse.body.fragments.id}.png`)
      .auth('user1@email.com', 'password1');

    expect(getResponse.status).toBe(200);
    expect(getResponse.get('Content-Type')).toContain('image/png');
    expect(Buffer.isBuffer(getResponse.body)).toBe(true);
  });

  test('Conversion: PNG to GIF', async () => {
    const imgPath = path.join(__dirname, '../asset', 'example.png');
    const data = fs.readFileSync(imgPath);

    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(data);

    const getResponse = await request(app)
      .get(`/v1/fragments/${postResponse.body.fragments.id}.gif`)
      .auth('user1@email.com', 'password1');

    expect(getResponse.status).toBe(200);
    expect(getResponse.get('Content-Type')).toContain('image/gif');
    expect(Buffer.isBuffer(getResponse.body)).toBe(true);
  });

  test('Conversion: PNG to WEBP', async () => {
    const imgPath = path.join(__dirname, '../asset', 'example.png');
    const data = fs.readFileSync(imgPath);

    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(data);

    const getResponse = await request(app)
      .get(`/v1/fragments/${postResponse.body.fragments.id}.webp`)
      .auth('user1@email.com', 'password1');

    expect(getResponse.status).toBe(200);
    expect(getResponse.get('Content-Type')).toContain('image/webp');
    expect(Buffer.isBuffer(getResponse.body)).toBe(true);
  });

  test('Conversion: PNG to JPEG', async () => {
    const imgPath = path.join(__dirname, '../asset', 'example.png');
    const data = fs.readFileSync(imgPath);

    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(data);

    const getResponse = await request(app)
      .get(`/v1/fragments/${postResponse.body.fragments.id}.jpg`)
      .auth('user1@email.com', 'password1');

    expect(getResponse.status).toBe(200);
    expect(getResponse.get('Content-Type')).toContain('image/jpeg');
    expect(Buffer.isBuffer(getResponse.body)).toBe(true);
  });

  // JPEG Conversions
  test('Conversion: JPEG to PNG', async () => {
    const imgPath = path.join(__dirname, '../asset', 'example.jpg');
    const data = fs.readFileSync(imgPath);

    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/jpeg')
      .send(data);

    const getResponse = await request(app)
      .get(`/v1/fragments/${postResponse.body.fragments.id}.png`)
      .auth('user1@email.com', 'password1');

    expect(getResponse.status).toBe(200);
    expect(getResponse.get('Content-Type')).toContain('image/png');
    expect(Buffer.isBuffer(getResponse.body)).toBe(true);
  });

  test('Conversion: JPEG to GIF', async () => {
    const imgPath = path.join(__dirname, '../asset', 'example.jpg');
    const data = fs.readFileSync(imgPath);

    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/jpeg')
      .send(data);

    const getResponse = await request(app)
      .get(`/v1/fragments/${postResponse.body.fragments.id}.gif`)
      .auth('user1@email.com', 'password1');

    expect(getResponse.status).toBe(200);
    expect(getResponse.get('Content-Type')).toContain('image/gif');
    expect(Buffer.isBuffer(getResponse.body)).toBe(true);
  });

  test('Conversion: JPEG to WEBP', async () => {
    const imgPath = path.join(__dirname, '../asset', 'example.jpg');
    const data = fs.readFileSync(imgPath);

    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/jpeg')
      .send(data);

    const getResponse = await request(app)
      .get(`/v1/fragments/${postResponse.body.fragments.id}.webp`)
      .auth('user1@email.com', 'password1');

    expect(getResponse.status).toBe(200);
    expect(getResponse.get('Content-Type')).toContain('image/webp');
    expect(Buffer.isBuffer(getResponse.body)).toBe(true);
  });

  test('Conversion: JPEG to JPEG', async () => {
    const imgPath = path.join(__dirname, '../asset', 'example.jpg');
    const data = fs.readFileSync(imgPath);

    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/jpeg')
      .send(data);

    const getResponse = await request(app)
      .get(`/v1/fragments/${postResponse.body.fragments.id}.jpg`)
      .auth('user1@email.com', 'password1');

    expect(getResponse.status).toBe(200);
    expect(getResponse.get('Content-Type')).toContain('image/jpeg');
    expect(Buffer.isBuffer(getResponse.body)).toBe(true);
  });

  test('Conversion: JPEG to AVIF', async () => {
    const imgPath = path.join(__dirname, '../asset', 'example.jpg');
    const data = fs.readFileSync(imgPath);

    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/jpeg')
      .send(data);

    const getResponse = await request(app)
      .get(`/v1/fragments/${postResponse.body.fragments.id}.avif`)
      .auth('user1@email.com', 'password1');

    expect(getResponse.status).toBe(200);
    expect(getResponse.get('Content-Type')).toContain('image/avif');
    expect(Buffer.isBuffer(getResponse.body)).toBe(true);
  });
});
