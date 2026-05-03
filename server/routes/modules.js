const router    = require('express').Router();
const NodeCache = require('node-cache');
const modules   = require('../data/modules');
const { getModel } = require('../lib/gemini');

/* 24-hour AI content cache — avoids redundant API calls */
const cache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

const SYSTEM_INSTRUCTION =
  'You are an expert election education content writer. ' +
  'Produce clear, structured, non-partisan educational content using markdown formatting. ' +
  'Use ## for section headings, **bold** for key terms, numbered lists for processes, ' +
  'blockquote (>) prefixed with 🌍 for "Did You Know?" callouts, and tables for comparisons. ' +
  'Be factual, engaging, and accessible to a general adult audience.';

/* GET /api/modules — lightweight list (no AI) */
router.get('/', (_req, res) => {
  const list = modules.map(({ id, icon, title, description, difficulty, readTime }) => ({
    id, icon, title, description, difficulty, readTime,
  }));
  res.json({ modules: list });
});

/* GET /api/modules/:id — full module with AI-generated or fallback content */
router.get('/:id', async (req, res) => {
  const id  = parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id < 1 || id > 8) {
    return res.status(404).json({ error: 'Module not found' });
  }

  const mod = modules.find((m) => m.id === id);
  if (!mod) return res.status(404).json({ error: 'Module not found' });

  /* Return cached AI content if available */
  const cacheKey = `module_${id}`;
  const cached   = cache.get(cacheKey);
  if (cached) return res.json({ ...mod, content: cached, fromCache: true });

  const model = getModel(SYSTEM_INSTRUCTION);

  /* Demo/fallback mode */
  if (!model) {
    return res.json({ ...mod, content: mod.content, fromCache: false, demo: true });
  }

  try {
    const prompt = `Explain the election topic: "${mod.topic}" for a general audience.
Format using markdown:
- ## headings for each section
- Numbered steps for processes  
- > 🌍 Did You Know? callout with a surprising fact
- A comparison table if relevant
- **Bold** key terms
- Keep under 600 words, factual, non-partisan.`;

    const result  = await model.generateContent(prompt);
    const content = result.response.text();
    cache.set(cacheKey, content);
    res.json({ ...mod, content, fromCache: false });
  } catch (err) {
    console.error('[modules] Gemini error:', err.message);
    /* Graceful degradation — always return something useful */
    res.json({ ...mod, content: mod.content, fromCache: false, demo: true });
  }
});

module.exports = router;
