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

    // Get token from cookies (uncomment when ready)
    // const token = request.cookies.get('authToken')?.value;
    // if (!token) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // if (!decoded) {
    //   return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    // }

    const body = await request.json();
    const { userId, formData, profileSetup } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get form configuration to validate structure
    const formSections = await FormSection.find().sort({ order: 1 });
    
    // Prepare update data
    const updateData = {
      updatedAt: new Date()
    };

    // Process each section from the form configuration
    for (const section of formSections) {
      if (formData[section.name]) {
        // Add each field from the section to the update data
        for (const field of section.fields) {
          if (formData[section.name][field.name] !== undefined) {
            // Handle special field types
            let value = formData[section.name][field.name];
            
            // Convert empty strings to null for database
            if (value === '') {
              value = null;
            }
            // Convert numbers if field type is number
            else if (field.type === 'number' && value !== null) {
              value = Number(value);
            }
            // Convert boolean for checkbox
            else if (field.type === 'checkbox') {
              value = Boolean(value);
            }

            updateData[field.name] = value;
          }
        }
      }
    }

    // Handle profile setup preferences
    if (profileSetup) {
      updateData.profileSetup = {
        willAdminFill: Boolean(profileSetup.willAdminFill),
        dontAskAgain: Boolean(profileSetup.dontAskAgain)
      };
    }

    // Handle photos if provided
    if (body.photos) {
      updateData.photos = body.photos.map(photo => ({
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