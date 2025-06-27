// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import User from '@/models/User';
// import dbConnect from '@/utils/dbConnect';
// import cloudinary from '@/utils/cloudinary';

// export async function DELETE(request) {
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

//     // Get user before deletion
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return NextResponse.json(
//         { message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // Delete profile photo from Cloudinary if exists
//     if (user.profilePhoto) {
//       const publicId = user.profilePhoto.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(`profile_photos/${publicId}`);
//     }

//     // Delete user
//     await User.findByIdAndDelete(decoded.userId);

//     // Create response and clear cookie
//     const response = NextResponse.json(
//       { message: 'Account deleted successfully' },
//       { status: 200 }
//     );

//     response.cookies.set('authToken', '', {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       expires: new Date(0),
//       path: '/',
//     });

//     return response;
//   } catch (error) {
//     console.error('Error deleting account:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }