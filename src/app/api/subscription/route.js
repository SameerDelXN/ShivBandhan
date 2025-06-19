// src/app/api/subscription/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Subscription from "@/models/Subscription";

// POST /api/subscription - Create new subscription
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const newPlan = new Subscription(body);
    const saved = await newPlan.save();

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: "Failed to create", error: error.message }, { status: 500 });
  }
}

// GET /api/subscription - Fetch all subscriptions
export async function GET() {
  try {
    await connectDB();
    const plans = await Subscription.find();
    return NextResponse.json(plans);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Failed to fetch", error: error.message }, { status: 500 });
  }
}
