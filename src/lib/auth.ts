import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { db } from './db';

const SECRET_KEY = process.env.AUTH_SECRET || 'bcgsp-secret-key-change-in-production';
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Password hashing using Node.js crypto scrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, storedKey] = hash.split(':');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(
    Buffer.from(derivedKey.toString('hex'), 'hex'),
    Buffer.from(storedKey, 'hex')
  );
}

// Simple token generation using base64 encoding with expiry
export function generateToken(payload: { userId: string; role: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'bcgsp', typ: 'token' })).toString('base64');
  const expiry = Date.now() + TOKEN_EXPIRY;
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp: expiry })
  ).toString('base64');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${header}.${body}`)
    .digest('base64');
  return `${header}.${body}.${signature}`;
}

// Verify token and return payload or null
export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(`${header}.${body}`)
      .digest('base64');

    if (signature !== expectedSignature) return null;

    // Decode payload
    const payload = JSON.parse(Buffer.from(body, 'base64').toString());

    // Check expiry
    if (payload.exp && Date.now() > payload.exp) return null;

    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}

// Get user from request headers/cookies
export async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  let token: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // Also check cookies
  if (!token) {
    token = request.cookies.get('bcgsp_token')?.value || null;
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

// Require auth - returns user or throws error response
export async function requireAuth(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return { user: null, error: { status: 401, message: 'Authentication required' } };
  }
  return { user, error: null };
}

// Require admin role
export async function requireAdmin(request: NextRequest) {
  const result = await requireAuth(request);
  if (result.error) return result;
  if (result.user!.role !== 'admin') {
    return { user: null, error: { status: 403, message: 'Admin access required' } };
  }
  return result;
}
