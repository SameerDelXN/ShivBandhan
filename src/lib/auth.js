import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key';
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week in seconds

export function createToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: MAX_AGE,
  });
}

export function setTokenCookie(token) {
  cookies().set('authToken', token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser() {
  const token = cookies().get('authToken')?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  // You would need to import your User model and dbConnect here
  // This is just a conceptual example
  const User = require('@/models/User');
  await require('@/lib/dbConnect')();

  return await User.findById(decoded.userId).select('-__v');
}