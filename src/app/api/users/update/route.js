import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
export const dynamic = 'force-dynamic';

export async function PUT(request) {
  try {
    await dbConnect();

    console.log("DB connected✅");
    

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
const {
  // Basic Info
  name,
  dob,
  currentCity,
  maritalStatus,
  height,
  motherTongue,
  gender,
  religion,
  caste,
  subCaste,
  gothra,
  education,
  fieldOfStudy,
  college,
  occupation,
  company,
  income,
  weight,
  userId,
  verificationStatus,
  email,
  bloodGroup,
  complexion,
  wearsLens,
  permanentAddress,
  profilePhoto,
  // Relative Info
  fatherName,
  parentResidenceCity,
  mother,
  brothers,
  marriedBrothers,
  sisters,
  marriedSisters,
  nativeDistrict,
  nativeCity,
  familyWealth,
  relativeSurname,
  parentOccupation,
  mamaSurname,
  
  // Horoscope Info
  rashi,
  nakshira,
  charan,
  gan,
  nadi,
  mangal,
  birthPlace,
  birthTime,
  gotraDevak,
  
  // Expectations
  expectedCaste,
  preferredCity,
  expectedAgeDifference,
  expectedEducation,
  divorcee,
  expectedHeight,
  expectedIncome,
  
  // Photos
  photos
} = body;

console.log(body);

const updateData = {
  // Basic Info
  name,
  dob,
  currentCity,
  maritalStatus,
  height,
  motherTongue,
  gender,
  religion,
  caste,
  subCaste,
  gothra,
  education,
  fieldOfStudy,
  college,
  occupation,
  company,
  income,
  weight,
  verificationStatus,
  email,
  bloodGroup,
  complexion,
  wearsLens,
  permanentAddress,
  
  // Relative Info
  fatherName,
  parentResidenceCity,
  mother,
  brothers,
  marriedBrothers,
  sisters,
  marriedSisters,
  nativeDistrict,
  nativeCity,
  familyWealth,
  relativeSurname,
  parentOccupation,
  mamaSurname,
  profilePhoto,
  
  // Horoscope Info
  rashi,
  nakshira,
  charan,
  gan,
  nadi,
  mangal,
  birthPlace,
  birthTime,
  gotraDevak,
  
  // Expectations
  expectedCaste,
  preferredCity,
  expectedAgeDifference,
  expectedEducation,
  divorcee,
  expectedHeight,
  expectedIncome,
  
  // Photos
  photos,
  
  // Timestamp
  updatedAt: new Date()
};

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}