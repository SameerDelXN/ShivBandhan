
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user'; // Make sure this is your user model path

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    // Optional filters
    const filters = {};
    
    if (searchParams.get('gender')) {
      filters.gender = searchParams.get('gender');
    }

    if (searchParams.get('name')) {
      filters.name = { $regex: searchParams.get('name'), $options: 'i' }; // case-insensitive search
    }

    if (searchParams.get('minAge') && searchParams.get('maxAge')) {
      filters.age = {
        $gte: parseInt(searchParams.get('minAge')),
        $lte: parseInt(searchParams.get('maxAge')),
      };
    }

    // Add more filters as needed...

    const users = await User.find(filters).select('-password'); // Exclude sensitive fields

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch users' }, { status: 500 });
  }
}
