import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export type AuthUser = {
  id: number;
  role: 'ADMIN' | 'TEACHER';
};

export function authRequired(roles?: Array<AuthUser['role']>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      const payload = jwt.verify(token, config.jwtSecret) as AuthUser & { iat: number; exp: number };
      if (roles && !roles.includes(payload.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      (req as any).user = { id: payload.id, role: payload.role } satisfies AuthUser;
      next();
    } catch (e) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
}
