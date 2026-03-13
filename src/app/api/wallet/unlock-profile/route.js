import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { userId, targetProfileId } = await req.json();

    if (!userId || !targetProfileId) {
      return NextResponse.json({ error: 'User ID and Target Profile ID are required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if profile is already unlocked to prevent double charge
    if (user.unlockedProfiles && user.unlockedProfiles.includes(targetProfileId)) {
        return NextResponse.json({ success: true, message: 'Profile already unlocked' }, { status: 200 });
    }

    const COST = 199;

    // Check balance
    if ((user.walletBalance || 0) < COST) {
        return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 402 }); // 402 Payment Required
    }

    // Deduct and save
    user.walletBalance -= COST;
    if (!user.unlockedProfiles) {
        user.unlockedProfiles = [];
    }
    user.unlockedProfiles.push(targetProfileId);
    
    await user.save();

    return NextResponse.json({ success: true, newBalance: user.walletBalance }, { status: 200 });

  } catch (error) {
    console.error('Wallet profile unlock error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
