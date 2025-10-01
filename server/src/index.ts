import 'dotenv/config';
import { createServer } from 'http';
import app from './app.js';
import { prisma } from './prisma.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function main() {
  const server = createServer(app);
  server.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
  });
}

main().catch(async (err) => {
  console.error('[server] fatal error', err);
  await prisma.$disconnect();
  process.exit(1);
});
