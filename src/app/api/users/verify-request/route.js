import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    const { userId } = await req.json();
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        verificationRequested: true,
        verificationStatus: 'Pending',
        $set: { profileCompletion: 100 } // Ensure 100% before verification
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Verification submitted',
      user: {
        verificationStatus: user.verificationStatus,
        profileCompletion: user.profileCompletion
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}