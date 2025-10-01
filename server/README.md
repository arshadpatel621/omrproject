# OMR Node.js Server

This is the backend API for the OMR app.

## Prerequisites
- Node.js LTS (ensure `node -v` and `npm -v` work)
- PostgreSQL database

## Setup
1. Copy env
```
cp .env.example .env
```
Fill DATABASE_URL, JWT_SECRET, OMR_SERVICE_URL.

2. Install dependencies
```
npm install
```

3. Prisma
```
npx prisma generate
npx prisma migrate dev --name init
```

4. Run
```
npm run dev
```

Health check:
```
curl http://localhost:4000/health
```

## Key Endpoints
- POST /auth/register { email, password, role }
- POST /auth/login { email, password }
- POST /tests (ADMIN) { name, subject, date, versionCodes: ["A","B"], marking }
- POST /tests/:id/answer-keys/:code (ADMIN) { questions, answers: ["A","B",...] }
- POST /tests/:id/publish (ADMIN)
- GET  /tests (ADMIN sees all, TEACHER sees published)
- POST /submissions (TEACHER) multipart or JSON { testId, versionCode, studentIdentifier?, imageUrl? }
- POST /submissions/:id/process (TEACHER/ADMIN) -> calls OMR microservice
- GET  /submissions/results?testId=ID
- PUT  /submissions/:id/answers { answers: [...] } (manual correction)
- GET  /reports/test/:id.csv
