
// /app/api/subscriptions/checkout/route.js

import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { planId, amount, userId } = body;

    if (!planId || !amount || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // ₹499 → 49900 paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        userId,
        planId,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 });
  }
}
