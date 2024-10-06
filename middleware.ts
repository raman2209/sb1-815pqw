import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware } from './lib/auth';

export async function middleware(request: NextRequest) {
  const publicPaths = ['/', '/login', '/register'];
  
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return authMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};