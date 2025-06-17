import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Interest from "@/models/Interest";
import User from "@/models/User"; // Assuming you have a User model
export async function GET(req) {
  await connectDB();

  const userId = req.nextUrl.searchParams.get("userId");
  console.log("User ID:", userId);
  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }
  const interests = await Interest.find({ receiverId: userId })
  console.log("Interests:", interests);

  return NextResponse.json({ interests });
}
