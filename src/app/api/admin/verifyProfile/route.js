import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth'; // Adjust path if needed

// Accept/Reject user profile
export async function POST(req) {
  try {
    await dbConnect();
    const token = req.cookies.get('authToken')?.value;
    const decoded = verifyToken(token);

    if (!decoded?.userId) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await req.json();
    const { userId, action } = body;

    if (!userId || !['Verified', 'Rejected'].includes(action)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.verificationStatus = action;
    user.isVerified = action === 'Verified';
    user.verificationRequested = false;
    await user.save();

    return NextResponse.json({ message: `User ${action.toLowerCase()} successfully.` });
  } catch (error) {
    console.error('Error in verification API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
