import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Interest from "@/models/Interest";

export async function PATCH(req) {
  await connectDB();

  const { interestId, status } = await req.json();
  console.log("Interest ID:", interestId);
  console.log("Status:", status);
  if (!interestId || !["accepted", "declined"].includes(status)) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const interest = await Interest.findById(interestId);
  if (!interest) {
    return NextResponse.json({ message: "Interest not found" }, { status: 404 });
  }

  interest.status = status;
  await interest.save();

  return NextResponse.json({ message: "Status updated", interest });
}
// This route updates the status of an interest (accepted or declined).