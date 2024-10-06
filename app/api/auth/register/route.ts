import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json();

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    const token = await signToken(user);

    const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}