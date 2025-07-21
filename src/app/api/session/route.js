import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { createToken, setTokenCookie } from '@/lib/auth';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or your specific origin
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true' // Needed for cookies
};

export async function GET(request) {
  try {
    await dbConnect();
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      return new NextResponse(
        JSON.stringify({ user: null }),
        { status: 200, headers: corsHeaders }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return new NextResponse(
        JSON.stringify({ user: null }),
        { status: 200, headers: corsHeaders }
      );
    }

    const user = await User.findById(decoded.userId)
      .select('-__v -createdAt -updatedAt');

    if (!user) {
      return new NextResponse(
        JSON.stringify({ user: null }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new NextResponse(
      JSON.stringify({
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
          isVerified: user.isVerified,
          phoneIsVerified: user.phoneIsVerified,
          subscription: user?.subscription,
          profilePhoto: user.profilePhoto,
          gender: user?.gender
        }
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Session check error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { userId } = await request.json();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    const token = createToken(user._id);
    const response = new NextResponse(
      JSON.stringify({
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
          isVerified: user.isVerified,
          phoneIsVerified: user.phoneIsVerified,
          subscription: {
            isActive: user.subscription?.isActive || false,
          },
          profilePhoto: user.profilePhoto,
          subscription: user.subscription || null,
          gender: user?.gender
        }
      }),
      { headers: corsHeaders }
    );

    setTokenCookie(response, token);
    return response;

  } catch (error) {
    console.error('Session creation error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle OPTIONS requests for preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: corsHeaders
  });
}