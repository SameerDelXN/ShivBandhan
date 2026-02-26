import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import User from '@/models/User';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();
    const { userId, amount, action, razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Step 1: Create an Order
    if (action === 'create_order') {
      if (!amount || amount < 1) {
        return NextResponse.json({ error: 'Minimum amount is ₹1' }, { status: 400 });
      }

      const orderOptions = {
        amount: amount * 100, // Amount is in currency subunits (paise)
        currency: 'INR',
        receipt: `rw_${Date.now()}_${userId.toString().slice(-6)}`,
        payment_capture: 1 // Auto capture
      };

      const order = await razorpay.orders.create(orderOptions);
      return NextResponse.json({ success: true, order }, { status: 200 });
    }

    // Step 2: Verify and Add Funds
    if (action === 'verify_payment') {
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
         return NextResponse.json({ error: 'Missing payment verification details' }, { status: 400 });
      }

      // Verify signature manually
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }

      // If valid, increment user's wallet
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Razorpay provides details, let's fetch the actual payment amount to prevent fraud
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      
      if (payment.status !== 'captured') {
        return NextResponse.json({ error: 'Payment not captured successfully' }, { status: 400 });
      }
      
      const addedAmount = payment.amount / 100; // Translate back to INR

      // Update Database
      user.walletBalance = (user.walletBalance || 0) + addedAmount;
      await user.save();

      return NextResponse.json({ success: true, newBalance: user.walletBalance, addedAmount }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Wallet add funds error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
