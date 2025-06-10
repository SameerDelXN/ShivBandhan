import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get token from cookies
    const token = request.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId).select('-__v');
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Filter data based on privacy settings
    const userData = {
      name: user.privacySettings.showFullName ? user.name : undefined,
      phone: user.privacySettings.showContact ? user.phone : undefined,
      profilePhoto: user.privacySettings.showPhoto ? user.profilePhoto : undefined,
      gender: user.gender,
      dob: user.dob,
      religion: user.religion,
      caste: user.caste,
      education: user.education,
      city: user.city,
      state: user.state,
      isVerified: user.isVerified,
      preferences: user.preferences,
      subscription: user.subscription
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}