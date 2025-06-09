
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Profile from '@/models/profile';

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      minAge,
      maxAge,
      religion,
      caste,
      city,
      gender,
    } = body;

    // Build dynamic query object
    const query = {};

    if (gender) query.gender = gender;
    if (religion) query.religion = religion;
    if (caste) query.caste = caste;
    if (city) query.city = city;
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = minAge;
      if (maxAge) query.age.$lte = maxAge;
    }

    // Execute search
    const results = await Profile.find(query).lean();

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
