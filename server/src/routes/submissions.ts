import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authRequired } from '../middleware/auth.js';
import { z } from 'zod';
import multer from 'multer';
import axios from 'axios';
import { config } from '../config.js';

const upload = multer({ storage: multer.memoryStorage() });
export const submissionsRouter = Router();

// Teacher: create a submission (supports either file upload or imageUrl)
const submissionSchema = z.object({
  testId: z.number(),
  versionCode: z.string(),
  studentIdentifier: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

submissionsRouter.post('/', authRequired(['ADMIN', 'TEACHER']), upload.single('file'), async (req, res) => {
  const body = {
    testId: Number(req.body.testId),
    versionCode: req.body.versionCode,
    studentIdentifier: req.body.studentIdentifier,
    imageUrl: req.body.imageUrl,
  };
  const parse = submissionSchema.safeParse(body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const test = await prisma.test.findUnique({ where: { id: parse.data.testId } , include: { versions: true }});
  if (!test) return res.status(404).json({ error: 'Test not found' });
  const version = await prisma.testVersion.findFirst({ where: { testId: test.id, code: parse.data.versionCode } });
  if (!version) return res.status(404).json({ error: 'Version not found' });

  // In a real app you'd upload file to storage and set imageUrl; here we keep it minimal
  let imageUrl = parse.data.imageUrl || null;
  if (!imageUrl && req.file) {
    // For demo: we cannot persist binary; mark as unavailable
    imageUrl = `memory://upload/${Date.now()}-${req.file.originalname}`;
  }

  const sub = await prisma.submission.create({
    data: {
      testId: test.id,
      versionId: version.id,
      studentIdentifier: parse.data.studentIdentifier || null,
      imageUrl: imageUrl || '',
      status: 'PENDING',
    }
  });

  res.json(sub);
});

// Trigger processing for a submission
submissionsRouter.post('/:id/process', authRequired(['ADMIN', 'TEACHER']), async (req, res) => {
  const id = Number(req.params.id);
  const submission = await prisma.submission.findUnique({ where: { id }, include: { version: { include: { answerKey: true, test: true } } } });
  if (!submission) return res.status(404).json({ error: 'Submission not found' });
  if (!submission.version.answerKey) return res.status(400).json({ error: 'Answer key not set' });

  await prisma.submission.update({ where: { id }, data: { status: 'PROCESSING' } });

  try {
    // Call OMR service
    const payload = {
      imageUrl: submission.imageUrl,
      questions: submission.version.answerKey.questions,
      // In a full system you'd pass template metadata; simplified here
    };
    const { data } = await axios.post(`${config.omrServiceUrl}/process`, payload, { timeout: 60000 });
    // data.answers: Array<'A'|'B'|'C'|'D'|'N'>
    const answers = Array.isArray(data?.answers) ? data.answers as string[] : [];

    // Score
    const correctKey = (submission.version.answerKey.answers as unknown as string[]);
    const test = submission.version.test;
    let score = 0;
    const answerCreates = answers.map((ans, i) => {
      const correct = correctKey[i] || 'N';
      let qScore = 0;
      if (ans === 'N') qScore = test.markBlank;
      else if (ans === correct) qScore = test.markCorrect;
      else qScore = test.markWrong;
      score += qScore;
      return { questionNumber: i + 1, selected: ans, correct: ans === correct };
    });

    await prisma.submission.update({
      where: { id },
      data: {
        status: 'COMPLETE',
        score,
        answers: { deleteMany: {}, createMany: { data: answerCreates } },
      }
    });

    res.json({ id, score, answers: answerCreates });
  } catch (e) {
    await prisma.submission.update({ where: { id }, data: { status: 'ERROR' } });
    res.status(500).json({ error: 'OMR processing failed' });
  }
});

// List results by test
submissionsRouter.get('/results', authRequired(['ADMIN', 'TEACHER']), async (req, res) => {
  const testId = Number(req.query.testId);
  if (!testId) return res.status(400).json({ error: 'testId required' });
  const subs = await prisma.submission.findMany({
    where: { testId },
    include: { answers: true }
  });
  res.json(subs);
});

// Manual correction
const correctionSchema = z.object({
  answers: z.array(z.enum(['A', 'B', 'C', 'D', 'N']))
});

submissionsRouter.put('/:id/answers', authRequired(['ADMIN', 'TEACHER']), async (req, res) => {
  const id = Number(req.params.id);
  const parse = correctionSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const submission = await prisma.submission.findUnique({ where: { id }, include: { version: { include: { answerKey: true, test: true } } } });
  if (!submission) return res.status(404).json({ error: 'Submission not found' });
  const correctKey = (submission.version.answerKey?.answers as unknown as string[]) || [];
  const test = submission.version.test;
  let score = 0;
  const answerCreates = parse.data.answers.map((ans, i) => {
    const correct = correctKey[i] || 'N';
    let qScore = 0;
    if (ans === 'N') qScore = test.markBlank;
    else if (ans === correct) qScore = test.markCorrect;
    else qScore = test.markWrong;
    score += qScore;
    return { questionNumber: i + 1, selected: ans, correct: ans === correct };
  });

  await prisma.submission.update({
    where: { id },
    data: {
      status: 'COMPLETE',
      score,
      answers: { deleteMany: {}, createMany: { data: answerCreates } },
    }
  });

  res.json({ id, score, answers: answerCreates });
});
