import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}