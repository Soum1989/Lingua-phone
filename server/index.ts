import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { chatRoutes } from './routes/chat.js';
import { translationRoutes } from './routes/translation.js';
import { speechRoutes } from './routes/speech.js';
import { pronunciationRoutes } from './routes/pronunciation.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Mount API routers under /api
app.use('/api/chat', chatRoutes);
app.use('/api/translation', translationRoutes);
app.use('/api/speech', speechRoutes);
app.use('/api/pronunciation', pronunciationRoutes);

// Serve frontend static assets if present
const clientDist = path.join(__dirname, '..', 'dist');
const clientIndex = path.join(clientDist, 'index.html');

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // SPA fallback
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Route not found', path: req.path });
    }
    res.sendFile(clientIndex);
  });
} else {
  // Development fallback: return a helpful HTML pointing to the vite dev server
  app.get('/', (_req, res) => {
    res.send(`
      <html>
        <head><meta charset="utf-8"/><title>LinguaBot - Dev server</title></head>
        <body>
          <h1>LinguaBot backend is running</h1>
          <p>The frontend dev server is likely running separately (vite). Open the client at <a href="http://localhost:5173">http://localhost:5173</a></p>
          <p>API endpoints are mounted under <code>/api/*</code>.</p>
        </body>
      </html>
    `);
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 404 handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

const PORT = parseInt(process.env.PORT || '5173', 10);
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});