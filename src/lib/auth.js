import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import dbConnect from './dbConnect';

export async function getUserFromToken() {
  await dbConnect();
  const token = cookies().get('token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.userId);
  } catch (err) {
    return null;
  }
}
