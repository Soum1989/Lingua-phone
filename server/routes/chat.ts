import express from 'express';
import { ChatService } from '../services/chatService.js';

const router = express.Router();
const chatService = new ChatService();

router.post('/', async (req, res) => {
  try {
    const { message, targetLanguage, userLanguage } = req.body;

    if (!message || !targetLanguage) {
      return res.status(400).json({
        error: 'Missing required fields: message, targetLanguage'
      });
    }

    const response = await chatService.processMessage(message, targetLanguage, userLanguage);
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as chatRoutes };