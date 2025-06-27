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
    const { showFullName, showPhoto, showContact ,userId} = body;
    
    const updateData = {
      privacySettings: {
        showFullName: showFullName !== undefined ? showFullName : false,
        showPhoto: showPhoto !== undefined ? showPhoto : false,
        showContact: showContact !== undefined ? showContact : false
      },
      updatedAt: new Date()
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-__v');

    return NextResponse.json({
      message: 'Privacy settings updated successfully',
      privacySettings: updatedUser.privacySettings
    });
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}