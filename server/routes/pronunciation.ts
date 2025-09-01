import express from 'express';
import { PronunciationService } from '../services/pronunciationService';

const router = express.Router();
const pronunciationService = new PronunciationService();

router.post('/', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No audio file provided'
      });
    }

    const { expectedText, language } = req.body;
    const audioBuffer = req.file.buffer;

    if (!expectedText || !language) {
      return res.status(400).json({
        error: 'Missing required fields: expectedText, language'
      });
    }

    const score = await pronunciationService.scorePronunciation(audioBuffer, expectedText, language);
    res.json(score);
  } catch (error) {
    console.error('Pronunciation scoring error:', error);
    res.status(500).json({
      error: 'Failed to score pronunciation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as pronunciationRoutes };