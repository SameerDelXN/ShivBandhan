
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Profile from '@/models/profile';

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    // Find profile by ID
    const profile = await Profile.findById(id).lean();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error('GET /api/profiles/:id error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
