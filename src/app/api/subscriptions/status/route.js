// /app/api/subscriptions/status/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const user = await User.findById(userId).select('subscription');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { subscription } = user;

    return NextResponse.json({
      planId: subscription?.planId || 'free',
      status: subscription?.status || 'inactive',
      subscribedAt: subscription?.subscribedAt || null,
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
