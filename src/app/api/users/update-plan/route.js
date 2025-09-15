import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Subscription from '@/models/Subscription';

export async function PATCH(req) {
  await connectDB();

  const { userId, planId, razorpay_payment_id, currentSubscriptionId } = await req.json();

  // Validate input
  if (!userId || !planId || !razorpay_payment_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Find plan details
    const plan = await Subscription.findById(planId);
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Ensure plan is active
    if (!plan.isActive) {
      return NextResponse.json({ error: 'Selected plan is inactive' }, { status: 400 });
    }

    // Calculate expiry date
    let expiresAt;
    const currentUser = await User.findById(userId);
    if (currentSubscriptionId && currentUser?.subscription?.expiresAt > new Date()) {
      // Extend from current expiration if subscription is still active
      expiresAt = new Date(
        currentUser.subscription.expiresAt.getTime() +
          plan.durationInDays * 24 * 60 * 60 * 1000
      );
    } else {
      // Start from now if no active subscription
      expiresAt = new Date(Date.now() + plan.durationInDays * 24 * 60 * 60 * 1000);
    }

    // Update user's subscription
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'subscription.plan': plan.name.trim(),
          'subscription.expiresAt': expiresAt,
          'subscription.transactionId': razorpay_payment_id,
          'subscription.subscriptionId': planId,
          'subscription.isSubscribed': true,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Subscription updated', user: updatedUser },
      { status: 200 }
    );
  } catch (err) {
    console.error('Subscription update error:', err);
    return NextResponse.json(
      { error: 'Something went wrong', details: err.message },
      { status: 500 }
    );
  }
}