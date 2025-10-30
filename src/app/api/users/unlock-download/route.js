import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PATCH(req) {
  try {
    await dbConnect();

    const { userId, razorpay_payment_id } = await req.json();

    if (!userId || !razorpay_payment_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'downloadAccess.isUnlocked': true,
          'downloadAccess.transactionId': razorpay_payment_id,
          'downloadAccess.unlockedAt': new Date(),
        },
      },
      { new: true }
    ).select('-__v');

    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated }, { status: 200 });
  } catch (err) {
    console.error('unlock-download error:', err);
    return NextResponse.json({ error: 'Something went wrong', details: err.message }, { status: 500 });
  }
}
