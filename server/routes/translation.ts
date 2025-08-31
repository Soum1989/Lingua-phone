import express from 'express';
import { TranslationService } from '../services/translationService.js';

const router = express.Router();
const translationService = new TranslationService();

router.post('/', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        error: 'Missing required fields: text, targetLanguage'
      });
    }

    const result = await translationService.translate(text, targetLanguage, sourceLanguage);
    res.json(result);
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      error: 'Failed to translate text',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as translationRoutes };