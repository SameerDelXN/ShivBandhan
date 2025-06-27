// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import User from '@/models/User';
// import dbConnect from '@/utils/dbConnect';
// import cloudinary from '@/utils/cloudinary';

// export async function POST(request) {
//   try {
//     await dbConnect();
    
//     // Get token from cookies
//     const token = request.cookies.get('authToken')?.value;
//     if (!token) {
//       return NextResponse.json(
//         { message: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded) {
//       return NextResponse.json(
//         { message: 'Invalid token' },
//         { status: 401 }
//       );
//     }

//     const formData = await request.formData();
//     const file = formData.get('file');
    
//     if (!file) {
//       return NextResponse.json(
//         { message: 'No file uploaded' },
//         { status: 400 }
//       );
//     }

//     // Convert file to buffer
//     const buffer = await file.arrayBuffer();
//     const array = new Uint8Array(buffer);
    
//     // Upload to Cloudinary
//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         {
//           folder: 'profile_photos',
//           resource_type: 'image',
//           public_id: `user_${decoded.userId}_profile`,
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       ).end(array);
//     });

//     const updatedUser = await User.findByIdAndUpdate(
//       decoded.userId,
//       { profilePhoto: result.secure_url },
//       { new: true }
//     ).select('-__v');

//     return NextResponse.json({
//       message: 'Profile photo updated successfully',
//       profilePhoto: updatedUser.profilePhoto
//     });
//   } catch (error) {
//     console.error('Error updating profile photo:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }