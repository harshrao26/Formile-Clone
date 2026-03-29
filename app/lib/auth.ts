import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined in environment variables');
  return secret;
}

export interface AuthPayload {
  adminId: string;
  email: string;
  role: 'superadmin' | 'user';
}

export function verifyAuth(request: NextRequest): AuthPayload | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getSecret()) as AuthPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function createToken(payload: AuthPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' });
}
