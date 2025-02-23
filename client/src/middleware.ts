import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/utils/jwt';

export function middleware(request: NextRequest) {
  // Paths that don't require authentication
  const publicPaths = ['/login', '/signup', '/forgot-password'];
  const isPublicPath = publicPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Get token from cookies
  const token = request.cookies.get('clickup_session')?.value;

  // If trying to access public path while logged in, redirect to dashboard
  if (isPublicPath && token) {
    const payload = verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If trying to access protected path without token, redirect to login
  if (!isPublicPath && !token) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('clickup_session');
    return response;
  }

  // If token exists but is invalid, clear it and redirect to login
  if (token) {
    const payload = verifyToken(token);
    if (!payload && !isPublicPath) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('clickup_session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
