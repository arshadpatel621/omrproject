import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { authRouter } from './routes/auth.js';
import { testsRouter } from './routes/tests.js';
import { submissionsRouter } from './routes/submissions.js';
import { reportsRouter } from './routes/reports.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Optional request logging (fallback to minimal if morgan missing)
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const morganLoaded = require('morgan') as typeof morgan;
  app.use(morganLoaded('dev'));
} catch (_) {
  // noop
}

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRouter);
app.use('/tests', testsRouter);
app.use('/submissions', submissionsRouter);
app.use('/reports', reportsRouter);

export default app;
