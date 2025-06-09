
import dbConnect from '@/lib/dbConnect';
const User = require('@/models/user');

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { phone, role } = body;

    if (!phone) {
      return new Response(JSON.stringify({ success: false, message: 'Phone is required' }), { status: 400 });
    }

    // Check if user with phone already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return new Response(JSON.stringify({ success: false, message: 'User with this phone already exists' }), { status: 400 });
    }

    // Create user (isVerified will be false by default, role defaults to 'user' if not provided)
    const newUser = new User({ phone,  role: role || 'user',  });

    await newUser.save();

    return new Response(JSON.stringify({ success: true, data: newUser }), {  status: 201, headers: { 'Content-Type': 'application/json' }, });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
