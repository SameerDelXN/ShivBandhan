import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
export const dynamic = 'force-dynamic';
export async function PUT(request) {
  try {
    await dbConnect();
    
    // Get token from cookies
    // const token = request.cookies.get('authToken')?.value;
    // if (!token) {
    //   return NextResponse.json(
    //     { message: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // // Verify token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // if (!decoded) {
    //   return NextResponse.json(
    //     { message: 'Invalid token' },
    //     { status: 401 }
    //   );
    // }

    const body = await request.json();
    const { ageRange, religion, caste, city ,userId} = body;
    
    // Validate age range
    if (ageRange && (ageRange.min > ageRange.max)) {
      return NextResponse.json(
        { message: 'Minimum age cannot be greater than maximum age' },
        { status: 400 }
      );
    }

    const updateData = {
      preferences: {
        ageRange,
        religion,
        caste,
        city
      },
      updatedAt: new Date()
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    return NextResponse.json({
      message: 'Preferences updated successfully',
      preferences: updatedUser.preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}