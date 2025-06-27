import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const pendingUsers = await User.find({
      verificationRequested: true,
      verificationStatus: 'Pending'
    }).select('name email profilePhoto profileCompletion verificationStatus');

    return NextResponse.json({ users: pendingUsers });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pending verifications' },
      { status: 500 }
    );
  }
}