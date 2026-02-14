import { Router } from 'express';
import { Contact } from '../models/Contact.js';
import { CompanyJob } from '../models/CompanyJob.js';
import { Feedback } from '../models/Feedback.js';
import { requireAuth } from '../middleware/auth.js';
import { isDBConnected } from '../db.js';

const router = Router();
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.authenticated = true;
    req.session.username = username;
    return res.json({ success: true });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

router.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/login') return next();
  if (req.path === '/logout' || req.path === '/me') return next();
  if (!isDBConnected()) {
    return res.status(503).json({ error: 'Database not available. Add MONGODB_URI to .env or .env.local.' });
  }
  next();
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get('/me', (req, res) => {
  if (req.session && req.session.authenticated) {
    return res.json({ authenticated: true, username: req.session.username });
  }
  res.json({ authenticated: false });
});

router.get('/contacts', requireAuth, async (req, res) => {
  try {
    const list = await Contact.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) {
    console.error('Contacts list error:', err);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

router.get('/companies', requireAuth, async (req, res) => {
  try {
    const list = await CompanyJob.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) {
    console.error('Companies list error:', err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

router.get('/feedback', requireAuth, async (req, res) => {
  try {
    const list = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) {
    console.error('Feedback list error:', err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

export default router;
