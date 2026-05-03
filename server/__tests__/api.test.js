const request = require('supertest');

// Mock the Gemini lib to return predictable responses
const mockGetModel = jest.fn().mockReturnValue(null);
jest.mock('../lib/gemini', () => {
  return {
    getModel: mockGetModel,
    MODEL_ID: 'gemini-2.5-flash',
  };
});

const app        = require('../index');
const geminiMock = require('../lib/gemini');

beforeEach(() => {
  mockGetModel.mockReset();
  mockGetModel.mockReturnValue(null); // Default to demo mode
});

describe('Health Check', () => {
  it('GET /api/health → 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toBeDefined();
  });
});

describe('Modules API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/modules → returns 8 modules', async () => {
    const res = await request(app).get('/api/modules');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.modules)).toBe(true);
    expect(res.body.modules).toHaveLength(8);
  });

  it('GET /api/modules/1 with AI key → returns AI generated content', async () => {
    geminiMock.getModel.mockReturnValueOnce({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => 'Mocked AI Content for Module' }
      })
    });
    const res = await request(app).get('/api/modules/1');
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Mocked AI Content for Module');
    expect(res.body.fromCache).toBe(false);
  });

  it('GET /api/modules/2 with AI error → graceful fallback', async () => {
    geminiMock.getModel.mockReturnValueOnce({
      generateContent: jest.fn().mockRejectedValue(new Error('AI failed'))
    });
    const res = await request(app).get('/api/modules/2');
    expect(res.status).toBe(200);
    expect(res.body.demo).toBe(true);
    expect(res.body.content).toBeDefined();
  });

  it('GET /api/modules/3 without AI key → instant fallback', async () => {
    geminiMock.getModel.mockReturnValueOnce(null);
    const res = await request(app).get('/api/modules/3');
    expect(res.status).toBe(200);
    expect(res.body.demo).toBe(true);
    expect(res.body.fromCache).toBe(false);
  });

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/glossary → returns 30 terms', async () => {
    const res = await request(app).get('/api/glossary');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.terms)).toBe(true);
    expect(res.body.terms.length).toBe(30);
  });

  it('GET /api/glossary/search?q=ballot → returns term from static list', async () => {
    const res = await request(app).get('/api/glossary/search?q=ballot');
    expect(res.status).toBe(200);
    expect(res.body.term.toLowerCase()).toBe('ballot');
    expect(res.body.fromCache).toBe(false);
  });

  it('GET /api/glossary/search?q=ballot again → returns from cache', async () => {
    const res = await request(app).get('/api/glossary/search?q=ballot');
    expect(res.status).toBe(200);
    expect(res.body.fromCache).toBe(true);
  });

  it('GET /api/glossary/search?q=unknown_term with AI → returns AI term', async () => {
    geminiMock.getModel.mockReturnValueOnce({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => '{"definition":"AI Def","example":"Ex","relatedTerms":[]}' }
      })
    });
    // Use a unique term so it's not cached
    const res = await request(app).get('/api/glossary/search?q=unknown_term');
    expect(res.status).toBe(200);
    expect(res.body.definition).toBe('AI Def');
  });

  it('GET /api/glossary/search?q=unknown_term_2 without AI → fallback', async () => {
    geminiMock.getModel.mockReturnValueOnce(null);
    const res = await request(app).get('/api/glossary/search?q=unknown_term_2');
    expect(res.status).toBe(200);
    expect(res.body.demo).toBe(true);
  });

  it('GET /api/glossary/search?q=a → 400 (too short)', async () => {
    const res = await request(app).get('/api/glossary/search?q=a');
    expect(res.status).toBe(400);
  });
});

describe('Chat API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/chat with valid message and AI configured → 200', async () => {
    geminiMock.getModel.mockReturnValueOnce({
      startChat: jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockResolvedValue({
          response: { text: () => 'Hello from AI' }
        })
      })
    });
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello' });
    expect(res.status).toBe(200);
    expect(res.body.reply).toBe('Hello from AI');
  });

  it('POST /api/chat with missing AI key → demo fallback', async () => {
    geminiMock.getModel.mockReturnValueOnce(null);
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello' });
    expect(res.status).toBe(200);
    expect(res.body.demo).toBe(true);
  });

  it('POST /api/chat with AI error → 502', async () => {
    geminiMock.getModel.mockReturnValueOnce({
      startChat: jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockRejectedValue(new Error('AI Error'))
      })
    });
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello' });
    expect(res.status).toBe(502);
  });

  it('POST /api/chat with empty message → 400', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: '' });
    expect(res.status).toBe(400);
  });
});

describe('Myths API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/myths/random with AI → 200', async () => {
    geminiMock.getModel.mockReturnValueOnce({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => '{"myth":"A","fact":"B","source":"C"}' }
      })
    });
    const res = await request(app).get('/api/myths/random');
    expect(res.status).toBe(200);
    expect(res.body.myth).toBe('A');
  });

  it('GET /api/myths/random with invalid AI JSON → 502', async () => {
    geminiMock.getModel.mockReturnValueOnce({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => 'Not JSON' }
      })
    });
    const res = await request(app).get('/api/myths/random');
    expect(res.status).toBe(502);
  });

  it('GET /api/myths/random without AI → 503 fallback', async () => {
    geminiMock.getModel.mockReturnValueOnce(null);
    const res = await request(app).get('/api/myths/random');
    expect(res.status).toBe(503);
  });
});

describe('404 Handler', () => {
  it('Unknown route → 404', async () => {
    const res = await request(app).get('/api/unknown-route-xyz');
    expect(res.status).toBe(404);
  });
});


