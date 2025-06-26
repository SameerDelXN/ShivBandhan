import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Get form data
    const formData = await request.formData();
    const userId = formData.get('userId');
    const file = formData.get('file');

    if (!userId || !file) {
      return NextResponse.json(
        { success: false, message: 'User ID and file are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'matrimony-profiles',
            transformation: [
              { width: 500, height: 500, crop: 'fill', gravity: 'face' },
              { quality: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(bytes);
    });

    // Update user in database
    const user = await User.findByIdAndUpdate(
      userId,
      {
        profilePhoto: result.secure_url,
        $inc: { profileCompletion: 10 },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      userId: user._id,
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, message: 'Error uploading image', error: error.message },
      { status: 500 }
    );
  }
}