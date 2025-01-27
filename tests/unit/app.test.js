// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('Middleware response check', () => {
  test('404 check', () => request(app).get('/fakeroute').expect(404));
});
