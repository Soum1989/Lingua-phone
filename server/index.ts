import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import multer from 'multer';
import { chatRoutes } from './routes/chat.js';
import { translationRoutes } from './routes/translation.js';
import { speechRoutes } from './routes/speech.js';
import { pronunciationRoutes } from './routes/pronunciation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the frontend build (in development, files are served by Vite)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('/home/project/dist'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/translate', translationRoutes);
app.use('/api/speech-to-text', upload.single('audio'), speechRoutes);
app.use('/api/text-to-speech', speechRoutes);
app.use('/api/pronunciation-score', upload.single('audio'), pronunciationRoutes);

// Serve frontend for all non-API routes (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile('/home/project/dist/index.html');
  });
} else {
  // In development, just return a simple message for non-API routes
  app.get('*', (req, res) => {
    res.json({ 
      message: 'LinguaBot API Server', 
      status: 'running',
      environment: 'development'
    });
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});