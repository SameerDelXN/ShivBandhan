import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { Weight } from 'lucide-react';
// export const dynamic = 'force-dynamic';2
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
    console.log('Token :', token);
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token', decoded);
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
    console.log('User found:', user);
    // Filter data based on privacy settings
    const userData = {
      name:  user.name || "Anonymous",
      phone: user.privacySettings.showContact ? user.phone : undefined,
      profilePhoto: user.privacySettings.showPhoto ? user.profilePhoto : undefined,
      gender: user.gender,
      dob: user.dob,
      religion: user.religion,
      caste: user.caste,
      education: user.education,
      currentCity: user.currentCity,
      weight: user.weight,
      maritalStatus: user.maritalStatus,
      motherTongue: user.motherTongue,  
      height: user.height,
      gothra: user.gothra,  
      subCaste: user.subCaste,
      fieldOfStudy: user.fieldOfStudy, 
      college: user.college,
      occupation: user.occupation,
      company: user.company,
      income: user.income,
      id: user._id, 
      state: user.state,
      isVerified: user.isVerified,
      preferences: user.preferences,
      subscription: user.subscription
    };
    console.log("Me = ",userData)
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}