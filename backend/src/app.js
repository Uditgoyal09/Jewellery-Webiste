import express from 'express';
import path from 'path';
import fs from 'fs';
import apiRoutes from './routes/index.js';
import { env } from './config/env.js';

export const createApp = () => {
  const app = express();

  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', apiRoutes);

  if (fs.existsSync(env.frontendDistPath)) {
    app.use(express.static(env.frontendDistPath));

    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }

      res.sendFile(path.join(env.frontendDistPath, 'index.html'));
    });
  } else {
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }

      res
        .status(503)
        .json({ message: 'Frontend build not found. Run `npm run frontend:build` from the project root.' });
    });
  }

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ message: error.message || 'Internal server error.' });
  });

  return app;
};
