
// /app/api/subscriptions/plans/route.js

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Define your subscription plans here
    const plans = [
      {
        id: 'free',
        name: 'Free Plan',
        price: 0,
        currency: 'INR',
        duration: 'lifetime',
        features: ['Basic browsing', 'Send 1 interest/day'],
      },
      {
        id: 'premium_monthly',
        name: 'Premium Monthly',
        price: 499,
        currency: 'INR',
        duration: '1 month',
        features: ['Unlimited interests', 'See who viewed your profile'],
      },
      {
        id: 'premium_yearly',
        name: 'Premium Yearly',
        price: 3999,
        currency: 'INR',
        duration: '1 year',
        features: ['All monthly features', 'Priority support', 'Profile boost'],
      },
    ];

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
