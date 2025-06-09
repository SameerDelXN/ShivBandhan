
// /src/app/api/interests/send/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Interest from '@/models/interest';

export async function POST(req) {
  try {
    await dbConnect();

    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: 'Both sender and receiver are required' }, { status: 400 });
    }

    // Check if already sent
    const existing = await Interest.findOne({ sender: senderId, receiver: receiverId });
    if (existing) {
      return NextResponse.json({ error: 'Interest already sent' }, { status: 409 });
    }

    const newInterest = new Interest({ sender: senderId, receiver: receiverId });
    await newInterest.save();

    return NextResponse.json({ message: 'Interest sent successfully' });
  } catch (error) {
    console.error('Interest send error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    await dbConnect();

    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Fetch all interests sent by this user
    const sentInterests = await Interest.find({ senderId: userId }).sort({ sentAt: -1 });

    return new Response(JSON.stringify(sentInterests), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching sent interests:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

