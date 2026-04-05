/**
 * tests/api/users-api.spec.js
 * ATC-001 → ATC-007: REST API Tests
 *
 * Uses Playwright's built-in `request` fixture (no browser needed).
 * Base URL: https://reqres.in (configured in playwright.config.js 'api' project)
 */
const { test, expect } = require('@playwright/test');
const { allure }       = require('allure-playwright');

test.describe('Users API', () => {

  // ─── ATC-001: GET /api/users ───────────────────────────────────
  test('ATC-001 | GET /api/users should return 200 with user list', async ({ request }) => {
    await allure.description('Verify GET /api/users returns HTTP 200 with a valid user array.');
    await allure.severity('critical');
    await allure.label('feature', 'Users API');
    await allure.label('story', 'List Users');

    const response = await allure.step('Send GET /api/users', async () =>
      request.get('/api/users')
    );

    await allure.step('Verify status 200', async () => {
      expect(response.status()).toBe(200);
    });

    await allure.step('Verify response body structure', async () => {
      const body = await response.json();
      expect(body).toHaveProperty('data');
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThan(0);

      const user = body.data[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('first_name');
      expect(user).toHaveProperty('last_name');
    });
  });

  // ─── ATC-002: POST /api/users ──────────────────────────────────
  test('ATC-002 | POST /api/users should create user and return 201', async ({ request }) => {
    await allure.description('Verify POST /api/users creates a new user and returns 201 with id and createdAt.');
    await allure.severity('critical');
    await allure.label('feature', 'Users API');
    await allure.label('story', 'Create User');

    const payload = { name: 'Romel', job: 'QA Automation Engineer' };

    const response = await allure.step('Send POST /api/users', async () =>
      request.post('/api/users', { data: payload })
    );

    await allure.step('Verify status 201', async () => {
      expect(response.status()).toBe(201);
    });

    await allure.step('Verify response body contains created user', async () => {
      const body = await response.json();
      expect(body.name).toBe(payload.name);
      expect(body.job).toBe(payload.job);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('createdAt');
    });
  });

  // ─── ATC-003: PUT /api/users/:id ──────────────────────────────
  test('ATC-003 | PUT /api/users/:id should update user and return 200', async ({ request }) => {
    await allure.description('Verify PUT /api/users/2 updates a user and returns 200 with updatedAt.');
    await allure.severity('normal');
    await allure.label('feature', 'Users API');
    await allure.label('story', 'Update User');

    const payload = { name: 'Romel Updated', job: 'Senior QA Engineer' };

    const response = await allure.step('Send PUT /api/users/2', async () =>
      request.put('/api/users/2', { data: payload })
    );

    await allure.step('Verify status 200', async () => {
      expect(response.status()).toBe(200);
    });

    await allure.step('Verify updated fields and updatedAt timestamp', async () => {
      const body = await response.json();
      expect(body.name).toBe(payload.name);
      expect(body.job).toBe(payload.job);
      expect(body).toHaveProperty('updatedAt');
    });
  });

  // ─── ATC-004: DELETE /api/users/:id ───────────────────────────
  test('ATC-004 | DELETE /api/users/:id should return 204', async ({ request }) => {
    await allure.description('Verify DELETE /api/users/2 returns HTTP 204 with an empty body.');
    await allure.severity('normal');
    await allure.label('feature', 'Users API');
    await allure.label('story', 'Delete User');

    const response = await allure.step('Send DELETE /api/users/2', async () =>
      request.delete('/api/users/2')
    );

    await allure.step('Verify status 204 and empty body', async () => {
      expect(response.status()).toBe(204);
      const text = await response.text();
      expect(text).toBe('');
    });
  });

  // ─── ATC-005: GET /api/users?page=2 ───────────────────────────
  test('ATC-005 | GET /api/users?page=2 should return paginated results', async ({ request }) => {
    await allure.description('Verify pagination fields (page, total, total_pages) are returned correctly.');
    await allure.severity('minor');
    await allure.label('feature', 'Users API');
    await allure.label('story', 'Pagination');

    const response = await allure.step('Send GET /api/users?page=2', async () =>
      request.get('/api/users?page=2')
    );

    await allure.step('Verify status 200 and pagination metadata', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.page).toBe(2);
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('total_pages');
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  // ─── ATC-006: POST /api/login — valid credentials ──────────────
  test('ATC-006 | POST /api/login with valid credentials should return token', async ({ request }) => {
    await allure.description('Verify a valid login returns HTTP 200 and a non-empty token string.');
    await allure.severity('critical');
    await allure.label('feature', 'Auth API');
    await allure.label('story', 'Login');

    const payload = { email: 'eve.holt@reqres.in', password: 'cityslicka' };

    const response = await allure.step('Send POST /api/login with valid credentials', async () =>
      request.post('/api/login', { data: payload })
    );

    await allure.step('Verify status 200 and token received', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('token');
      expect(typeof body.token).toBe('string');
      expect(body.token.length).toBeGreaterThan(0);
    });
  });

  // ─── ATC-007: POST /api/login — invalid credentials ───────────
  test('ATC-007 | POST /api/login with invalid credentials should return 400', async ({ request }) => {
    await allure.description('Verify an invalid login returns HTTP 400 with an error message.');
    await allure.severity('critical');
    await allure.label('feature', 'Auth API');
    await allure.label('story', 'Login');

    const payload = { email: 'invalid@user.com', password: 'wrongpassword' };

    const response = await allure.step('Send POST /api/login with bad credentials', async () =>
      request.post('/api/login', { data: payload })
    );

    await allure.step('Verify status 400 and error in body', async () => {
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });
  });
});
