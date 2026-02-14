import { Router } from 'express';
import { CompanyJob } from '../models/CompanyJob.js';
import { isDBConnected } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  if (!isDBConnected()) {
    return res.status(503).json({ error: 'Database not available. Add MONGODB_URI to .env or .env.local.' });
  }
  try {
    const {
      companyName,
      jobTitle,
      location,
      jobType,
      experience,
      salaryRange,
      description,
      requirements,
      contactEmail,
      contactPhone,
      additionalInfo,
    } = req.body;
    if (!companyName || !jobTitle || !description) {
      return res.status(400).json({ error: 'Company name, job title and description are required' });
    }
    const doc = await CompanyJob.create({
      companyName,
      jobTitle,
      location: location || '',
      jobType: jobType || '',
      experience: experience || '',
      salaryRange: salaryRange || '',
      description,
      requirements: requirements || '',
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
      additionalInfo: additionalInfo || '',
    });
    res.status(201).json({ id: doc._id });
  } catch (err) {
    console.error('Company job create error:', err);
    res.status(500).json({ error: 'Failed to save job posting' });
  }
});

export default router;
