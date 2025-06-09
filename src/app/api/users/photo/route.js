
import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

// Disable default body parsing for Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to parse form data using formidable
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: false, uploadDir: path.join(process.cwd(), '/public/uploads'), keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

export async function POST(req) {
  try {
    await dbConnect();

    // Get token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Verify token and get user id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Parse form data
    const { files } = await parseForm(req);

    if (!files.photo) {
      return NextResponse.json({ message: 'No photo uploaded' }, { status: 400 });
    }

    const photo = files.photo;

    // Construct relative URL path for photo to be saved in DB
    const photoUrl = `/uploads/${path.basename(photo.filepath)}`;

    // Update user photo URL in DB
    const updatedUser = await User.findByIdAndUpdate(userId, { photo: photoUrl }, { new: true }).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}
