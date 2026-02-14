import { Router } from 'express';
import { Feedback } from '../models/Feedback.js';
import { isDBConnected } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  if (!isDBConnected()) {
    return res.status(503).json({ error: 'Database not available. Add MONGODB_URI to .env or .env.local.' });
  }
  try {
    const { feedback, overallScore } = req.body;
    if (!feedback || typeof feedback !== 'string') {
      return res.status(400).json({ error: 'Feedback text is required' });
    }
    const doc = await Feedback.create({
      feedback: feedback.trim(),
      overallScore: overallScore != null ? Number(overallScore) : null,
      source: 'interview_result',
    });
    res.status(201).json({ id: doc._id });
  } catch (err) {
    console.error('Feedback create error:', err);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

export default router;
