// This file handles the API route for fetching all users with pagination and filtering
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User'; // Assuming your User model is imported from here
import connectDB from '@/lib/dbConnect';
// Connect to MongoDB if not already connected
const getCorsHeaders = (req) => {
  const origin = req?.headers?.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin !== '*' ? origin : '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  };
};

export async function GET(request) {
  try {
    await connectDB();

    // Authenticate the user
    let token = request.cookies.get('authToken')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const extracted = authHeader.substring(7);
        if (extracted !== "undefined" && extracted !== "null") {
          token = extracted;
        }
      }
    }

    if (!token) {
      console.log('🔴 fetchAllUsers: No token found in cookies or headers');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401, headers: getCorsHeaders(request) }
      );
    }

    // Verify token
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🟢 fetchAllUsers: Token verified for userId:', decoded.userId);
    } catch (err) {
      console.error('🔴 fetchAllUsers: Token verification failed:', err.message);
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401, headers: getCorsHeaders(request) }
      );
    }

    // Get query parameters for potential filtering
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || 1000;
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
      .sort({ createdAt: -1 })
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
    },{ headers: getCorsHeaders(request) });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users', error: error.message },
      { status: 500, headers: getCorsHeaders(request) }
    );
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request)
  });
}
