// app/api/login/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    await dbConnect();
    const token = cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (err) {
    console.error('Login check failed:', err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }
}
