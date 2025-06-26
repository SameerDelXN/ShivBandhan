import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { createToken, setTokenCookie } from '@/lib/auth';

export async function GET(request) {
  try {
    await dbConnect();
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await User.findById(decoded.userId)
      .select('-__v -createdAt -updatedAt');
console.log('User found:', user);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        isVerified: user.isVerified,
        phoneIsVerified: user.phoneIsVerified,
        subscription: {

          isSubscribed: user.subscription?.isSubscribed || false, // Assuming subscription is a field in User
        },
        profilePhoto: user.profilePhoto,
      }
    });

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { userId } = await request.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const token = createToken(user._id);
    const response = NextResponse.json({
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        isVerified: user.isVerified,
        phoneIsVerified: user.phoneIsVerified,
        subscription: {
          isActive: user.subscription?.isActive || false, // Assuming subscription is a field in User
        },
        profilePhoto: user.profilePhoto,
        subscription: user.subscription || null,
      }
    });

    setTokenCookie(response, token);
    return response;

  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}