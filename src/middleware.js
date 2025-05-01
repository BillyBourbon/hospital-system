/* eslint-disable capitalized-comments */
import { NextResponse } from 'next/server';
import { getSession, updateSession } from './app/scripts/auth';

const routesDontRun = ['/_next', '/api', 'images'];
// Array of public routes
const publicRoutes = ['/', '/login', '/signup'];
// Array of protected routes
const protectedRoutes = ['/dashboard', '/appointment'];

export default async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (routesDontRun.map((r) => pathname.startsWith(r)).includes(true)) return;

  // Get current session
  const session = await getSession();
  // console.log(`Current Path: ${pathname} | Middleware Session:`, session);

  // Refresh session if exists
  if (session) await updateSession(session);

  // Handle protected routes
  // If (protectedRoutes.some((route) => pathname.startsWith(route)) && !session) {
  if (
    (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/appointment')) &&
    !session
  ) {
    console.log('Redirecting to login (protected route)');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Handle login routes for logged-in users
  if (publicRoutes.includes(pathname) && session) {
    console.log('Redirecting to dashboard (already authenticated)');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
