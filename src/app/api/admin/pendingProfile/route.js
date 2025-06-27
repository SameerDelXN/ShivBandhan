import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    await dbConnect();

    const token = req.cookies.get('authToken')?.value;
    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await User.find({
      verificationRequested: true,
      verificationStatus: 'Pending',
    }).select('name email gender dob currentCity profilePhoto profileCompletion');

    const enriched = users.map((u) => ({
      _id: u._id.toString(),
      name: u.name,
      email: u.email,
      gender: u.gender,
      location: u.currentCity,
      photo: u.profilePhoto || '/default-user.jpg',
      profileCompletion: u.profileCompletion || 0,
      age: u.dob ? Math.floor((Date.now() - new Date(u.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A',
    }));

    return NextResponse.json({ users: enriched });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
