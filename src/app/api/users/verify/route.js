
// /app/api/users/verify/route.js
import dbConnect from '@/lib/dbConnect';
const User = require('@/models/user');

export async function POST(req) {
  try {
    await dbConnect();
    const { userId } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data: updatedUser }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}
