import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { connectDB } from './db.js';
import app from './app.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

await connectDB();

// In production, serve Vite build and SPA fallback
if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, '..', 'dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
