import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();

    // Plan prices
    const planPrices = {
      premium: 1999,
      gold: 999,
      silver: 899
    };

    // Count users by plan
    const premiumCount = await User.countDocuments({ 'subscription.plan': 'Premium Plan' });
    const goldCount = await User.countDocuments({ 'subscription.plan': 'gold' });
    const silverCount = await User.countDocuments({ 'subscription.plan': 'silver' });
    const totalUsers = await User.countDocuments();
    console.log('Total Users:', premiumCount);
    // Total revenue from all paid plans
    const revenue =
      premiumCount * planPrices.premium +
      goldCount * planPrices.gold +
      silverCount * planPrices.silver;

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email phone profilePhoto isVerified subscription createdAt');

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          premiumUsers: premiumCount,
          // goldUsers and silverUsers not required anymore
          revenue,
          changes: {
            totalUsers: '+12%',
            premiumUsers: '+15%',
            revenue: '+18%',
          }
        },
        recentUsers
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}
