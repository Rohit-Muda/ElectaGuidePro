const router    = require('express').Router();
const rateLimit = require('express-rate-limit');
const { getModel } = require('../lib/gemini');

const limiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  handler: (_req, res) =>
    res.status(429).json({ error: 'Too many myth requests — please wait a moment.' }),
});

const SYSTEM_INSTRUCTION =
  'You are a fact-checking expert specializing in election misinformation. ' +
  'You provide accurate, evidence-based corrections to common election myths. ' +
  'Always be non-partisan and cite real organisations or studies. ' +
  'Respond with raw JSON only — no markdown, no extra text.';

/* GET /api/myths/random */
router.get('/random', limiter, async (_req, res) => {
  const model = getModel(SYSTEM_INSTRUCTION);

  if (!model) {
    return res.status(503).json({ error: 'AI not configured — using client-side fallback myths.' });
  }

  try {
    const prompt =
      'Generate one common election myth that many people believe. ' +
      'Return JSON: { "myth": "...", "fact": "...", "source": "..." } ' +
      'where myth is the false belief, fact is the evidence-based truth in 1–2 sentences, ' +
      'and source is a real organisation or study that verifies this. ' +
      'Be non-partisan and factual.';

    const result = await model.generateContent(prompt);
    const text   = result.response.text().trim().replace(/^```json\n?|```$/g, '').trim();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: 'Invalid AI response format.' });
    }

    /* Validate expected shape */
    if (!data.myth || !data.fact) {
      return res.status(502).json({ error: 'AI response missing required fields.' });
    }

    res.json(data);
  } catch (err) {
    console.error('[myths] Gemini error:', err.message);
    res.status(502).json({ error: 'AI temporarily unavailable — using client fallback.' });
  }
});

module.exports = router;
