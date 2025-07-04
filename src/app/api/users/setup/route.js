// File: src/app/api/users/setup/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User'; 

export async function PUT(request) {  // 
  try {
    await dbConnect();
    // Extract data from request
    const { userId, willAdminFill, dontAskAgain } = await request.json(); 

    // Update user with profileSetup
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {  
          'profileSetup.willAdminFill': willAdminFill,
          'profileSetup.dontAskAgain': willAdminFill ? true : dontAskAgain  
        }
      },
      { new: true }  
    );

    // Return success response
    return NextResponse.json({  
      success: true,
      message: willAdminFill 
        ? 'Our team will contact you shortly' 
        : 'You can now edit your profile'
  
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(  
      { success: false, message: 'Update failed' },
      { status: 500 }
    );
  }
}