import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Interest from "@/models/Interest";

export async function POST(req) {
  await connectDB();
  const { senderId, receiverId } = await req.json();

  const existing = await Interest.findOne({ senderId, receiverId });
  if (existing) {
    return NextResponse.json(
      { message: "Already sent interest." },
      { status: 400 }
    );
  }

  const interest = new Interest({ senderId, receiverId });
  await interest.save();

  return NextResponse.json({ message: "Interest sent", interest });
}
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
  const interests = await Interest.find({ senderId: userId })
  console.log("Interests:", interests);

  return NextResponse.json({ interests });
}
