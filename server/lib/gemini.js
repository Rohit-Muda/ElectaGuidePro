/**
 * Shared Gemini AI client — lazy-initialized singleton.
 * Centralizes model config; all routes import from here.
 */

const MODEL_ID = 'gemini-2.5-flash';

let _genAI = null;

/**
 * Returns a GoogleGenerativeAI instance if GEMINI_API_KEY is set, else null.
 * Lazy-loaded so the server starts cleanly without a key (demo mode).
 */
const getGenAI = () => {
  if (_genAI) return _genAI;
  if (!process.env.GEMINI_API_KEY) return null;
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return _genAI;
};

/**
 * Returns a configured GenerativeModel instance or null.
 * @param {string} [systemInstruction] - Optional system-level instruction
 */
const getModel = (systemInstruction) => {
  const ai = getGenAI();
  if (!ai) return null;
  return ai.getGenerativeModel({
    model: MODEL_ID,
    ...(systemInstruction ? { systemInstruction } : {}),
  });
};

module.exports = { getGenAI, getModel, MODEL_ID };
