// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import User from '@/models/User';
// import dbConnect from '@/lib/dbConnect';
// export const dynamic = 'force-dynamic';

// export async function PUT(request) {
//   try {
//     await dbConnect();

//     console.log("DB connected✅");
    

//     // Get token from cookies
//     // const token = request.cookies.get('authToken')?.value;
//     // if (!token) {
//     //   return NextResponse.json(
//     //     { message: 'Unauthorized' },
//     //     { status: 401 }
//     //   );
//     // }

//     // // Verify token
//     // const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // if (!decoded) {
//     //   return NextResponse.json(
//     //     { message: 'Invalid token' },
//     //     { status: 401 }
//     //   );
//     // }

//    const body = await request.json();
// const {
//   // Basic Info
//   name,
//   dob,
//   currentCity,
//   maritalStatus,
//   height,
//   motherTongue,
//   gender,
//   religion,
//   caste,
//   subCaste,
//   gothra,
//   education,
//   fieldOfStudy,
//   college,
//   occupation,
//   company,
//   income,
//   weight,
//   userId,
//   verificationStatus,
//   email,
//   bloodGroup,
//   complexion,
//   wearsLens,
//   permanentAddress,
//   profilePhoto,
//   // Relative Info
//   fatherName,
//   parentResidenceCity,
//   mother,
//   brothers,
//   marriedBrothers,
//   sisters,
//   marriedSisters,
//   nativeDistrict,
//   nativeCity,
//   familyWealth,
//   relativeSurname,
//   parentOccupation,
//   mamaSurname,
  
//   // Horoscope Info
//   rashi,
//   nakshira,
//   charan,
//   gan,
//   nadi,
//   mangal,
//   birthPlace,
//   birthTime,
//   gotraDevak,
  
//   // Expectations
//   expectedCaste,
//   preferredCity,
//   expectedAgeDifference,
//   expectedEducation,
//   divorcee,
//   expectedHeight,
//   expectedIncome,

// // Profile Setup
//       profileSetup,
  
//   // Photos
//   photos
// } = body;

// console.log(body);

// const updateData = {
//   // Basic Info
//   name,
//   dob,
//   currentCity,
//   maritalStatus,
//   height,
//   motherTongue,
//   gender,
//   religion,
//   caste,
//   subCaste,
//   gothra,
//   education,
//   fieldOfStudy,
//   college,
//   occupation,
//   company,
//   income,
//   weight,
//   verificationStatus,
//   email,
//   bloodGroup,
//   complexion,
//   wearsLens,
//   permanentAddress,
  
//   // Relative Info
//   fatherName,
//   parentResidenceCity,
//   mother,
//   brothers,
//   marriedBrothers,
//   sisters,
//   marriedSisters,
//   nativeDistrict,
//   nativeCity,
//   familyWealth,
//   relativeSurname,
//   parentOccupation,
//   mamaSurname,
//   profilePhoto,
  
//   // Horoscope Info
//   rashi,
//   nakshira,
//   charan,
//   gan,
//   nadi,
//   mangal,
//   birthPlace,
//   birthTime,
//   gotraDevak,
  
//   // Expectations
//   expectedCaste,
//   preferredCity,
//   expectedAgeDifference,
//   expectedEducation,
//   divorcee,
//   expectedHeight,
//   expectedIncome,
  
//   // Photos
//   photos,
//    profileSetup: {
//         willAdminFill: profileSetup?.willAdminFill ,
//         dontAskAgain: profileSetup?.dontAskAgain 
//       },
  
//   // Timestamp
//   updatedAt: new Date()
// };

// console.log('Update Data:', userId);

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       updateData,
  
//       { new: true, runValidators: true }
//     ).select('-__v');

//     if (!updatedUser) {
//       return NextResponse.json(
//         { message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(updatedUser);
//   } catch (error) {
//     console.error('Error updating user profile:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

//api/users/update
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import FormSection from '@/models/FormSection';
import dbConnect from '@/lib/dbConnect';

export const dynamic = 'force-dynamic';

export async function PUT(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { userId, ...formData } = body; // Destructure to get userId and the rest as formData

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get form configuration to validate structure
    const formSections = await FormSection.find().sort({ order: 1 });
    
    // Prepare update data - start with the formData as it comes flat from the frontend
    const updateData = {
      ...formData, // Spread all form data first
      updatedAt: new Date()
    };

    // Remove any undefined or null values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    // Handle profile setup preferences if they exist
    if (formData.profileSetup) {
      updateData.profileSetup = {
        willAdminFill: Boolean(formData.profileSetup.willAdminFill),
        dontAskAgain: Boolean(formData.profileSetup.dontAskAgain)
      };
    }

    // Handle photos if provided
    if (formData.photos) {
      updateData.photos = formData.photos.map(photo => ({
        url: photo.url,
        isPrimary: photo.isPrimary
      }));
    }

    console.log('Updating user with data:', updateData);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v -password');

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error.message 
      },
      { status: 500 }
    );
  }
}