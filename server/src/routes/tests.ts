import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authRequired } from '../middleware/auth.js';
import { z } from 'zod';

export const testsRouter = Router();

const createTestSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  date: z.string().transform((s) => new Date(s)),
  versionCodes: z.array(z.string().min(1)).min(1),
  marking: z
    .object({ correct: z.number().default(1), wrong: z.number().default(0), blank: z.number().default(0) })
    .default({ correct: 1, wrong: 0, blank: 0 }),
});

// Admin: Create a test with versions
testsRouter.post('/', authRequired(['ADMIN']), async (req, res) => {
  const parse = createTestSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { name, subject, date, versionCodes, marking } = parse.data as any;
  const test = await prisma.test.create({
    data: {
      name,
      subject,
      date,
      markCorrect: marking.correct,
      markWrong: marking.wrong,
      markBlank: marking.blank,
      versions: {
        create: versionCodes.map((code: string) => ({ code }))
      }
    },
    include: { versions: true }
  });
  res.json(test);
});

// Admin: Upload answer key for a version
const answerKeySchema = z.object({
  questions: z.number().min(1),
  answers: z.array(z.enum(['A', 'B', 'C', 'D', 'N'])).min(1) // N for no-answer
});

testsRouter.post('/:testId/answer-keys/:code', authRequired(['ADMIN']), async (req, res) => {
  const { testId, code } = req.params;
  const parse = answerKeySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const test = await prisma.test.findUnique({ where: { id: Number(testId) }, include: { versions: true } });
  if (!test) return res.status(404).json({ error: 'Test not found' });
  const version = await prisma.testVersion.findFirst({ where: { testId: test.id, code } });
  if (!version) return res.status(404).json({ error: 'Version not found' });

  const { questions, answers } = parse.data;
  if (answers.length !== questions) return res.status(400).json({ error: 'answers length must match questions' });

  const key = await prisma.answerKey.upsert({
    where: { versionId: version.id },
    update: { questions, answers: answers as any },
    create: { versionId: version.id, questions, answers: answers as any }
  });
  res.json(key);
});

// Admin: Publish test
testsRouter.post('/:testId/publish', authRequired(['ADMIN']), async (req, res) => {
  const { testId } = req.params;
  const test = await prisma.test.update({ where: { id: Number(testId) }, data: { published: true } });
  res.json(test);
});

// List tests (Admin gets all, Teacher gets published)
testsRouter.get('/', authRequired(['ADMIN', 'TEACHER']), async (req, res) => {
  const user = (req as any).user as { role: 'ADMIN' | 'TEACHER' };
  const where = user.role === 'ADMIN' ? {} : { published: true };
  const tests = await prisma.test.findMany({ where, include: { versions: { include: { answerKey: true } } } });
  res.json(tests);
});
