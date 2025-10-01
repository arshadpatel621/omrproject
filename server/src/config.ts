export const config = {
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  omrServiceUrl: process.env.OMR_SERVICE_URL || 'http://localhost:8000',
};
