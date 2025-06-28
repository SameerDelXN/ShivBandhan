// api/admin/logout/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // In a real implementation, you would:
    // 1. Invalidate the admin session/token on the server
    // 2. Clear any authentication cookies
    // 3. Perform any admin-specific cleanup
    
    const response = NextResponse.json(
      { success: true, message: 'Admin logged out successfully' },
      { status: 200 }
    );
    
    // Clear the admin auth cookie
    response.cookies.set('adminAuthToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/admin-dashboard',
    });

    return response;
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Admin logout failed' },
      { status: 500 }
    );
  }
}