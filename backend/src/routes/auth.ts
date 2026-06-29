import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'strategyos-secret-2026';

function makeToken(userId: string, email: string) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
  return jwt.encode({ userId, email, exp }, JWT_SECRET);
}

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, name } });
    const token = makeToken(user.id, user.email);
    res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const token = makeToken(user.id, user.email);
    res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ success: false });
  try {
    const payload = jwt.decode(header.slice(7), JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, email: true, name: true } });
    if (!user) return res.status(404).json({ success: false });
    res.json({ success: true, user });
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

export default router;
