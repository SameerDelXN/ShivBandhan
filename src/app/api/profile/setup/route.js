import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getUserFromToken } from '@/lib/auth';
import Profile from '@/models/profile';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  await dbConnect();

  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('image');
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = path.join(process.cwd(), 'public/uploads', fileName);
  fs.writeFileSync(filePath, buffer);

  const profile = await Profile.create({
    userId: user._id,
    fullName: formData.get('fullName'),
    dob: formData.get('dob'),
    gender: formData.get('gender'),
    religion: formData.get('religion'),
    education: formData.get('education'),
    profession: formData.get('profession'),
    image: `/uploads/${fileName}`
  });

  return NextResponse.json({ message: 'Profile created', profile }, { status: 201 });
}

