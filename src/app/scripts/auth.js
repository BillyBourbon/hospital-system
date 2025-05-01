'use server';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Secret Key. Should be in .env for production
const key = new TextEncoder().encode('secret');

// Duration the login cookie lasts.
const SESSION_DURATION = '1h';

async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(key);
}

async function decrypt(input) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Session decryption failed:', error);
    return null;
  }
}

// Login a user. Creates a cookie on the browser with a users details
async function login(user) {
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  const session = await encrypt({ user, expires });
  const cookiesStore = await cookies();
  cookiesStore.set({
    name: 'session',
    value: session,
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
}

// Clears the cookie
async function logout() {
  const cookiesStore = await cookies();
  cookiesStore.set({
    name: 'session',
    value: null,
    expires: new Date(0),
    path: '/',
  });
}

// Gets current session. Returns null if users not logged in.
async function getSession() {
  const cookiesStore = await cookies();
  const session = cookiesStore.get('session')?.value;
  return session ? await decrypt(session) : null;
}

// Refreshes a cookie.
async function updateSession() {
  const cookiesStore = await cookies();
  const session = cookiesStore.get('session')?.value;
  if (!session) return null;

  const parsed = await decrypt(session);
  if (!parsed) return null;

  const newExpires = new Date(Date.now() + 60 * 60 * 1000);
  const newSession = await encrypt({
    user: parsed.user,
    expires: newExpires,
  });

  const response = NextResponse.next();
  response.cookies.set({
    name: 'session',
    value: newSession,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: newExpires,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}

export { login, logout, updateSession, getSession };
