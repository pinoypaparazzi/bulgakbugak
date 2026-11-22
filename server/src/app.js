import express from 'express';
import cors from 'cors';
import { isDbConnected } from './db.js';
import inquiries from './routes/inquiries.js';

export function createApp({ corsOrigin } = {}) {
  const app = express();
  app.use(cors({ origin: corsOrigin ? corsOrigin.split(',').map((s) => s.trim()) : false }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (req, res) => {
    res.json({ ok: true, db: isDbConnected() ? 'connected' : 'disconnected' });
  });
  app.use('/api/inquiries', inquiries);

  app.use((req, res) => res.status(404).json({ error: 'Not found' }));
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: 'Something went wrong' });
  });
  return app;
}
