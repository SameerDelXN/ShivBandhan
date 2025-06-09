
// File: /app/api/interests/reject/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Interest from '@/models/interest';

export async function POST(req) {
  try {
    await dbConnect();

    const { senderId, receiverId } = await req.json();

    // Find and update interest
    const updatedInterest = await Interest.findOneAndUpdate(
      {
        sender: senderId,
        receiver: receiverId,
        status: 'pending',
      },
      {
        status: 'rejected',
      },
      {
        new: true,
      }
    );

    if (!updatedInterest) {
      return NextResponse.json(
        { error: 'No pending interest found to reject' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Interest rejected successfully',
      interest: updatedInterest,
    });
  } catch (error) {
    console.error('Error in rejecting interest:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
