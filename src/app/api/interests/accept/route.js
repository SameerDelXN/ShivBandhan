// File: /app/api/interests/accept/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Interest from '@/models/interest';
import Match from '@/models/match'; // Assuming you have a match model

export async function POST(req) {
  try {
    await dbConnect();

    const { senderId, receiverId } = await req.json();

    // 1. Update interest status
    const updatedInterest = await Interest.findOneAndUpdate(
      {
        sender: senderId,
        receiver: receiverId,
        status: 'pending',
      },
      {
        status: 'accepted',
      },
      {
        new: true,
      }
    );

    if (!updatedInterest) {
      return NextResponse.json(
        { error: 'No pending interest found to accept' },
        { status: 404 }
      );
    }

    // 2. Create Match
    const newMatch = await Match.create({
      users: [senderId, receiverId],
      matchedAt: new Date(),
    });

    return NextResponse.json({
      message: 'Interest accepted and match created',
      match: newMatch,
    });
  } catch (error) {
    console.error('Error in accepting interest:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
