import express from 'express';
import { SpeechService } from '../services/speechService.js';

const router = express.Router();
const speechService = new SpeechService();

// Speech to Text
router.post('/speech-to-text', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No audio file provided'
      });
    }

    const { language } = req.body;
    const audioBuffer = req.file.buffer;

    const text = await speechService.speechToText(audioBuffer, language);
    res.json({ text });
  } catch (error) {
    console.error('Speech to text error:', error);
    res.status(500).json({
      error: 'Failed to convert speech to text',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Text to Speech
router.post('/text-to-speech', async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text || !language) {
      return res.status(400).json({
        error: 'Missing required fields: text, language'
      });
    }

    const audioUrl = await speechService.textToSpeech(text, language);
    res.json({ audioUrl });
  } catch (error) {
    console.error('Text to speech error:', error);
    res.status(500).json({
      error: 'Failed to convert text to speech',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as speechRoutes };