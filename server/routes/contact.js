import { Router } from 'express';
import { Contact } from '../models/Contact.js';
import { isDBConnected } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  if (!isDBConnected()) {
    return res.status(503).json({ error: 'Database not available. Add MONGODB_URI to .env or .env.local.' });
  }
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const doc = await Contact.create({ name, email, subject, message });
    res.status(201).json({ id: doc._id });
  } catch (err) {
    console.error('Contact create error:', err);
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

export default router;
