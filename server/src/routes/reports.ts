import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authRequired } from '../middleware/auth.js';

export const reportsRouter = Router();

// CSV export per test
reportsRouter.get('/test/:testId.csv', authRequired(['ADMIN', 'TEACHER']), async (req, res) => {
  const testId = Number(req.params.testId);
  const test = await prisma.test.findUnique({ where: { id: testId } });
  if (!test) return res.status(404).json({ error: 'Test not found' });
  const submissions = await prisma.submission.findMany({
    where: { testId },
    include: { answers: true, version: true }
  });

  const header = ['submission_id', 'student', 'version', 'score'];
  const rows = submissions.map((s) => [s.id, s.studentIdentifier || '', s.version.code, s.score ?? 0]);

  const csv = [header, ...rows].map((r) => r.map((v) => String(v).replaceAll('"', '""')).map((v) => `"${v}"`).join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="test-${testId}.csv"`);
  res.send(csv);
});
