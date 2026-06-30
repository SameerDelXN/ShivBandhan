import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    // Get all users
    const users = await User.find({}).lean();

    // Gender counts
    const maleCount = users.filter(u => u.gender === 'Male').length;
    const femaleCount = users.filter(u => u.gender === 'Female').length;
    const otherGenderCount = users.filter(u => u.gender && u.gender !== 'Male' && u.gender !== 'Female').length;
    const unspecifiedGenderCount = users.filter(u => !u.gender).length;

    // Profile completion stats
    const completeProfiles = users.filter(u => (u.profileCompletion || 0) === 100).length;
    const incompleteProfiles = users.length - completeProfiles;

    // Incomplete profiles list (profileCompletion < 100)
    const incompleteProfilesList = users
      .filter(u => (u.profileCompletion || 0) < 100)
      .map(u => ({
        _id: u._id,
        name: u.name || 'N/A',
        phone: u.phone || 'N/A',
        email: u.email || 'N/A',
        shivbandhanId: u.shivbandhanId || '',
        profileCompletion: u.profileCompletion || 0,
        gender: u.gender || 'N/A',
        createdAt: u.createdAt,
      }));

    // Payment/Subscription stats
    const successfulPayments = users.filter(u => u.subscription?.transactionId && u.subscription?.isSubscribed);
    const unsuccessfulPayments = users.filter(u => !u.subscription?.transactionId || !u.subscription?.isSubscribed);

    // Transaction reports
    const allTransactions = users
      .filter(u => u.subscription?.transactionId || u.subscription?.plan !== 'free')
      .map(u => ({
        _id: u._id,
        name: u.name || 'N/A',
        phone: u.phone || 'N/A',
        email: u.email || 'N/A',
        shivbandhanId: u.shivbandhanId || '',
        plan: u.subscription?.plan || 'free',
        transactionId: u.subscription?.transactionId || '-',
        isSubscribed: u.subscription?.isSubscribed || false,
        expiresAt: u.subscription?.expiresAt || null,
        status: u.subscription?.transactionId && u.subscription?.isSubscribed ? 'Success' : 'Pending/Failed',
        createdAt: u.createdAt,
      }));

    const successfulTransactions = allTransactions.filter(t => t.status === 'Success');
    const unsuccessfulTransactions = allTransactions.filter(t => t.status !== 'Success');

    // Monthly registration trend (last 12 months)
    const now = new Date();
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthName = monthStart.toLocaleString('en-US', { month: 'short', year: '2-digit' });

      const monthUsers = users.filter(u => {
        const created = new Date(u.createdAt);
        return created >= monthStart && created <= monthEnd;
      });

      monthlyData.push({
        month: monthName,
        male: monthUsers.filter(u => u.gender === 'Male').length,
        female: monthUsers.filter(u => u.gender === 'Female').length,
        total: monthUsers.length,
      });
    }

    // Subscription plan distribution
    const planDistribution = {};
    users.forEach(u => {
      const plan = u.subscription?.plan || 'free';
      planDistribution[plan] = (planDistribution[plan] || 0) + 1;
    });

    const planData = Object.entries(planDistribution).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));

    // Verification status distribution
    const verificationDistribution = {};
    users.forEach(u => {
      const status = u.verificationStatus || 'Unverified';
      verificationDistribution[status] = (verificationDistribution[status] || 0) + 1;
    });

    const verificationData = Object.entries(verificationDistribution).map(([name, value]) => ({
      name,
      value,
    }));

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalUsers: users.length,
          maleCount,
          femaleCount,
          otherGenderCount,
          unspecifiedGenderCount,
          completeProfiles,
          incompleteProfiles,
          successfulPayments: successfulPayments.length,
          unsuccessfulPayments: unsuccessfulPayments.length,
        },
        charts: {
          monthlyRegistrations: monthlyData,
          planDistribution: planData,
          genderDistribution: [
            { name: 'Male', value: maleCount },
            { name: 'Female', value: femaleCount },
            { name: 'Other', value: otherGenderCount },
            { name: 'Unspecified', value: unspecifiedGenderCount },
          ].filter(d => d.value > 0),
          profileCompletion: [
            { name: 'Complete', value: completeProfiles },
            { name: 'Incomplete', value: incompleteProfiles },
          ],
          paymentStatus: [
            { name: 'Successful', value: successfulPayments.length },
            { name: 'Unsuccessful', value: unsuccessfulPayments.length },
          ],
          verificationStatus: verificationData,
        },
        reports: {
          successfulTransactions,
          unsuccessfulTransactions,
          allTransactions,
          incompleteProfiles: incompleteProfilesList,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching report data:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
