import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getPlanLimits } from '@/lib/subscriptionLimits';

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

    // Handle Subscription Quota
    const plan = user.subscription?.plan || 'free';
    const limits = getPlanLimits(plan);
    const isSubscribed = !!user.subscription?.isSubscribed;

    // Reset weekly unlocks if a week has passed
    const now = new Date();
    const lastReset = user.subscription?.usage?.lastWeeklyReset || user.createdAt;
    const diffDays = (now - new Date(lastReset)) / (1000 * 60 * 60 * 24);

    if (diffDays >= 7) {
      user.subscription.usage.weeklyUnlocks = 0;
      user.subscription.usage.lastWeeklyReset = now;
    }

    // If subscribed and has quota left
    if (isSubscribed && (user.subscription.usage.weeklyUnlocks < limits.weeklyContacts || limits.weeklyContacts === Infinity)) {
      user.subscription.usage.weeklyUnlocks += 1;
      if (!user.unlockedProfiles) user.unlockedProfiles = [];
      user.unlockedProfiles.push(targetProfileId);
      await user.save();
      return NextResponse.json({ 
        success: true, 
        message: 'Profile unlocked using subscription quota',
        remainingQuota: limits.weeklyContacts === Infinity ? 'Unlimited' : (limits.weeklyContacts - user.subscription.usage.weeklyUnlocks)
      }, { status: 200 });
    }

    // Default Wallet Deduction logic
    const COST = 199;

    // Check balance
    if ((user.walletBalance || 0) < COST) {
        return NextResponse.json({ error: 'Insufficient wallet balance and no subscription quota left' }, { status: 402 });
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
