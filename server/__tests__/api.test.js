const request = require('supertest');
const app     = require('../index');

describe('Health Check', () => {
  it('GET /api/health → 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toBeDefined();
  });
});

describe('Modules API', () => {
  /* Ensure Gemini is not called in test (no key = instant fallback) */
  beforeAll(() => { delete process.env.GEMINI_API_KEY; });

  it('GET /api/modules → returns 8 modules', async () => {
    const res = await request(app).get('/api/modules');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.modules)).toBe(true);
    expect(res.body.modules).toHaveLength(8);
  });

  it('GET /api/modules/1 → returns module with content', async () => {
    const res = await request(app).get('/api/modules/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBeDefined();
    expect(res.body.content).toBeDefined();
  }, 10000);

  it('GET /api/modules/99 → 404', async () => {
    const res = await request(app).get('/api/modules/99');
    expect(res.status).toBe(404);
  });
});

describe('Quiz API', () => {
  it('GET /api/quiz/1 → returns 5 questions', async () => {
    const res = await request(app).get('/api/quiz/1');
    expect(res.status).toBe(200);
    expect(res.body.questions).toHaveLength(5);
    expect(res.body.questions[0]).toHaveProperty('q');
    expect(res.body.questions[0]).toHaveProperty('options');
    expect(res.body.questions[0]).toHaveProperty('correct');
  });

  it('GET /api/quiz/99 → 404', async () => {
    const res = await request(app).get('/api/quiz/99');
    expect(res.status).toBe(404);
  });

  it('POST /api/quiz/result with valid data → saved: true', async () => {
    const res = await request(app)
      .post('/api/quiz/result')
      .send({ moduleId: 1, score: 4, sessionId: 'test-session-123' });
    expect(res.status).toBe(200);
    expect(res.body.saved).toBe(true);
  });

  it('POST /api/quiz/result with invalid score → 400', async () => {
    const res = await request(app)
      .post('/api/quiz/result')
      .send({ moduleId: 1, score: 99, sessionId: 'test-session-123' });
    expect(res.status).toBe(400);
  });
});

describe('Glossary API', () => {
  it('GET /api/glossary → returns 30 terms', async () => {
    const res = await request(app).get('/api/glossary');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.terms)).toBe(true);
    expect(res.body.terms.length).toBe(30);
  });

  it('GET /api/glossary/search?q=ballot → returns term', async () => {
    const res = await request(app).get('/api/glossary/search?q=ballot');
    expect(res.status).toBe(200);
    expect(res.body.term).toBeDefined();
    expect(res.body.definition).toBeDefined();
  });

  it('GET /api/glossary/search?q=a → 400 (too short)', async () => {
    const res = await request(app).get('/api/glossary/search?q=a');
    expect(res.status).toBe(400);
  });
});

describe('404 Handler', () => {
  it('Unknown route → 404', async () => {
    const res = await request(app).get('/api/unknown-route-xyz');
    expect(res.status).toBe(404);
  });
});
