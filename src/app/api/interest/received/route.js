import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Interest from "@/models/Interest";
import User from "@/models/User";
const getCorsHeaders = (req) => {
  const origin = req?.headers?.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin !== '*' ? origin : '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  };
};
export async function GET(request) {
  try {
    await connectDB();

    const userId = request.nextUrl.searchParams.get("userId");
    
    // Validate input
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400, headers: getCorsHeaders(request) }
      );
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404, headers: getCorsHeaders(request) }
      );
    }

    // Find all interests where the user is the receiver
    const interests = await Interest.find({ receiverId: userId });

    // Populate sender and receiver details
    const populatedInterests = await Promise.all(
      interests.map(async (interest) => {
        const sender = await User.findById(interest.senderId).select('-password'); // Exclude sensitive data
        const receiver = await User.findById(interest.receiverId).select('-password');
        return {
          ...interest._doc,
          sender,
          receiver
        };
      })
    );

    return NextResponse.json({ 
      success: true,
      count: populatedInterests.length,
      interests: populatedInterests 
    },{ headers: getCorsHeaders(request) });

  } catch (error) {
    console.error("Error fetching received interests:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Internal server error",
        error: error.message 
      },
      { status: 500, headers: getCorsHeaders(request) }
    );
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request)
  });
}
