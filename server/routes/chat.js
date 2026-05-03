const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const router    = require('express').Router();
const { getModel } = require('../lib/gemini');

const SYSTEM_INSTRUCTION =
  'You are ElectaGuide, a neutral, non-partisan election education assistant. ' +
  'Rules: ' +
  '1. Explain election concepts clearly using numbered steps when listing processes. ' +
  '2. Never endorse any political party, candidate, or ideology. ' +
  '3. Be factual, concise, and accessible to a general audience. ' +
  '4. End each reply with one suggested follow-up question prefixed with "💡 Follow-up:". ' +
  '5. Keep responses under 300 words unless the user asks for more detail.';

/* Per-IP rate limit: 20 requests / 15 min */
const chatLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX, 10)        || 20,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many requests — please wait before trying again.' },
  handler: (_req, res, _next, options) =>
    res.status(options.statusCode).json({ error: options.message.error }),
});

/**
 * Strip HTML tags and limit input length to prevent prompt injection.
 * Allows common punctuation needed for election questions.
 */
const sanitise = (text = '') =>
  text.replace(/<[^>]*>/g, '').trim().slice(0, 500);

/* POST /api/chat */
router.post(
  '/',
  chatLimiter,
  [
    body('message')
      .isString().trim().notEmpty().withMessage('message is required')
      .isLength({ max: 500 }).withMessage('message must be under 500 characters'),
    body('history').optional().isArray({ max: 20 }).withMessage('history must be an array'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const message = sanitise(req.body.message);
    const history = Array.isArray(req.body.history) ? req.body.history : [];

    const model = getModel(SYSTEM_INSTRUCTION);

    /* Demo mode — no API key */
    if (!model) {
      return res.json({
        reply:
          "I'm in demo mode (no API key configured).\n\n" +
          'Elections are the cornerstone of democracy, allowing citizens to choose ' +
          'their representatives through free and fair voting.\n\n' +
          '💡 Follow-up: Would you like to know how voter registration works?',
        demo: true,
      });
    }

    try {
      /* Build safe chat history — last 10 exchanges max */
      const safeHistory = history
        .slice(-10)
        .filter((m) => m.role && m.content && typeof m.content === 'string')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: sanitise(m.content) }],
        }));

      const chat   = model.startChat({ history: safeHistory });
      const result = await chat.sendMessage(message);
      const reply  = result.response.text();

      res.json({ reply });
    } catch (err) {
      console.error('[chat] Gemini error:', err.message);
      res.status(502).json({ error: 'AI service temporarily unavailable. Please try again.' });
    }
  }
);

module.exports = router;
