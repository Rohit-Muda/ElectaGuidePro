const router    = require('express').Router();
const NodeCache = require('node-cache');
const { query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const terms     = require('../data/glossary');
const { getModel } = require('../lib/gemini');

/* 7-day cache for AI-defined terms */
const cache = new NodeCache({ stdTTL: 86400 * 7, checkperiod: 3600 });

const SYSTEM_INSTRUCTION =
  'You are a concise election terminology expert. ' +
  'Define terms clearly for a general audience in 2–3 sentences with a real-world example. ' +
  'Always respond with raw JSON only — no markdown fences, no extra text.';

const searchLimiter = rateLimit({
  windowMs: 60_000,
  max: 15,
  handler: (_req, res) =>
    res.status(429).json({ error: 'Too many searches — please slow down.' }),
});

/* GET /api/glossary — all 30 pre-seeded terms */
router.get('/', (_req, res) => res.json({ terms }));

/* GET /api/glossary/search?q=term */
router.get(
  '/search',
  searchLimiter,
  [
    query('q')
      .isString().trim()
      .isLength({ min: 2, max: 80 })
      .withMessage('Query must be 2–80 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const q   = req.query.q.trim();
    const key = `glossary_${q.toLowerCase()}`;

    /* 1. Memory cache */
    const hit = cache.get(key);
    if (hit) return res.json({ ...hit, fromCache: true });

    /* 2. Static pre-seeded list */
    const staticMatch = terms.find(
      (t) => t.term.toLowerCase() === q.toLowerCase()
    );
    if (staticMatch) {
      cache.set(key, staticMatch);
      return res.json({ ...staticMatch, fromCache: false });
    }

    /* 3. AI definition */
    const model = getModel(SYSTEM_INSTRUCTION);
    if (!model) {
      return res.json({
        term: q,
        definition: `"${q}" is an election-related term. Add a Gemini API key to get AI-powered definitions.`,
        example: 'No example available in demo mode.',
        relatedTerms: [],
        demo: true,
      });
    }

    try {
      const prompt =
        `Define the election term "${q}". ` +
        `Return JSON: { "definition": "...", "example": "...", "relatedTerms": ["...", "...", "..."] }`;

      const result = await model.generateContent(prompt);
      const text   = result.response.text().trim().replace(/^```json\n?|```$/g, '').trim();

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        /* If JSON parse fails, surface partial text rather than crashing */
        parsed = { definition: text, example: '', relatedTerms: [] };
      }

      const entry = { term: q, ...parsed };
      cache.set(key, entry);
      res.json(entry);
    } catch (err) {
      console.error('[glossary] Gemini error:', err.message);
      res.status(502).json({ error: 'AI definition unavailable. Please try again.' });
    }
  }
);

module.exports = router;
