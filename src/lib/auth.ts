import 'server-only';

import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'modular_admin_session';
const sessionDurationSeconds = 60 * 60 * 8;

function sessionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET ausente ou inseguro. Consulte .env.example.');
  return new TextEncoder().encode(secret);
}

export async function verifyCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedEmail || !passwordHash) return false;
  const emailMatches = email.trim().toLowerCase() === expectedEmail.trim().toLowerCase();
  // Compara sempre o hash real, mesmo com e-mail errado: sem o short-circuit os dois casos
  // levam o mesmo tempo e o endpoint nao denuncia qual e o e-mail do admin.
  const passwordMatches = await bcrypt.compare(password, passwordHash);
  return emailMatches && passwordMatches;
}

export async function createSession(email: string) {
  const expiresAt = new Date(Date.now() + sessionDurationSeconds * 1000);
  const token = await new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(sessionKey());
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionKey(), { algorithms: ['HS256'] });
    if (payload.role !== 'admin' || typeof payload.email !== 'string') return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHORIZED');
  return session;
}
