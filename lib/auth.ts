import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function signToken(user: User): Promise<string> {
  return jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
}

export async function verifyToken(token: string): Promise<jwt.JwtPayload> {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
}

export async function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const decoded = await verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export async function getAuthUser(req: NextApiRequest): Promise<User | null> {
  const token = req.cookies.token;

  if (!token) {
    return null;
  }

  try {
    const decoded = await verifyToken(token);
    return await prisma.user.findUnique({ where: { id: decoded.userId } });
  } catch (error) {
    return null;
  }
}