// This file handles the API route for fetching all users with pagination and filtering
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User'; // Assuming your User model is imported from here
import connectDB from '@/lib/dbConnect';
// Connect to MongoDB if not already connected
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8081', // Must be explicit, not *
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

export async function GET(request) {
  try {
    await connectDB();

    // Get query parameters for potential filtering
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || 20;
    const page = searchParams.get('page') || 1;
    const skip = (page - 1) * limit;
    
    // Basic query - you can extend this with more filters as needed
    const query = {};
    
    // Optional: Add filters based on query parameters
    if (searchParams.get('isVerified')) {
      query.isVerified = searchParams.get('isVerified') === 'true';
    }

    if (searchParams.get('verificationStatus')) {
      query.verificationStatus = searchParams.get('verificationStatus');
    }
    
    
    if (searchParams.get('gender')) {
      query.gender = searchParams.get('gender');
    }
    
    // Fetch users with pagination
    const users = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v') // Exclude version key
      .lean(); // Convert to plain JavaScript objects
    
    // Get total count for pagination info
    const total = await User.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    },{headers:corsHeaders});
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users', error: error.message },
      { status: 500 ,headers:corsHeaders  }
    );
  }
}