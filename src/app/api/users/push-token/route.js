import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    await dbConnect();

    let token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
        token = request.cookies.get("authToken")?.value;
    }
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401, headers: corsHeaders });
    }

    const { pushToken } = await request.json();

    if (!pushToken) {
      return NextResponse.json(
        { message: "Push token is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    await User.findByIdAndUpdate(decoded.userId, { pushToken });

    return NextResponse.json(
      { success: true, message: "Push token updated" },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("Error updating push token:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
