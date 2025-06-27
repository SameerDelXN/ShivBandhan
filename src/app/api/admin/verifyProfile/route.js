import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth'; 


export async function POST(req) {
  try {
    await dbConnect();
    const { userId, action } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.verificationStatus = action;
    user.isVerified = (action === 'Verified');
    await user.save();

    return NextResponse.json({ 
      message: `User ${action.toLowerCase()} successfully` 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error during verification' },
      { status: 500 }
    );
  }
}