import { Request, Response, NextFunction } from 'express';
import jwt from 'jwt-simple';

export interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  try {
    const token = header.slice(7);
    const payload = jwt.decode(token, process.env.JWT_SECRET || 'strategyos-secret-2026');
    req.user = payload as { userId: string; email: string };
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const token = header.slice(7);
      const payload = jwt.decode(token, process.env.JWT_SECRET || 'strategyos-secret-2026');
      req.user = payload as { userId: string; email: string };
    } catch {
      // ignore invalid token for optional auth
    }
  }
  next();
}
