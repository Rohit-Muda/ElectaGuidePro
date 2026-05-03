const router    = require('express').Router();
const NodeCache = require('node-cache');
const { body, validationResult } = require('express-validator');
const modules   = require('../data/modules');
const quizData  = require('../data/quizQuestions');

const cache = new NodeCache({ stdTTL: 86400 });

/* GET /api/quiz/:moduleId — return 5 questions (static or AI-generated) */
router.get('/:moduleId', (req, res) => {
  const moduleId = parseInt(req.params.moduleId, 10);
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod) return res.status(404).json({ error: 'Module not found' });

  const questions = quizData[moduleId];
  if (!questions) return res.status(404).json({ error: 'Quiz not available for this module' });

  res.json({ moduleId, moduleTitle: mod.title, questions });
});

/* POST /api/quiz/result — save result (client-side session; we just validate & echo back) */
router.post(
  '/result',
  [
    body('moduleId').isInt({ min: 1, max: 8 }).withMessage('Invalid moduleId'),
    body('score').isInt({ min: 0, max: 5 }).withMessage('Score must be 0–5'),
    body('sessionId').isString().notEmpty().withMessage('sessionId required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { moduleId, score, sessionId } = req.body;
    /* In production this would persist to DB. For now we confirm receipt. */
    res.json({ saved: true, moduleId, score, sessionId, savedAt: new Date().toISOString() });
  }
);

module.exports = router;
