
// File: /app/api/interests/pending/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Interest from '@/models/interest';
import User from '@/models/user';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const pendingInterests = await Interest.find({
      receiver: userId,
      status: 'pending'
    })
      .populate('sender', 'name profilePicture') // optional: populate sender details
      .sort({ createdAt: -1 });

    return NextResponse.json(pendingInterests);
  } catch (error) {
    console.error('Error fetching pending interests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
