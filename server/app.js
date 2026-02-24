import express from 'express';
import cors from 'cors';
import session from 'express-session';
import contactRoutes from './routes/contact.js';
import companiesRoutes from './routes/companies.js';
import feedbackRoutes from './routes/feedback.js';
import adminRoutes from './routes/admin.js';
import interviewRoutes from './routes/interview.js';

const app = express();

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'API is running' });
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'mocklearn-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use('/api/contact', contactRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/interview', interviewRoutes);

app.use((err, _req, res, _next) => {
  console.error('[API error]', err);
  res.status(500).json({ error: err.message || 'Server error' });
});

export default app;
