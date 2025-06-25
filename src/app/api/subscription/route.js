// src/app/api/subscription/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Subscription from "@/models/Subscription";
import User from "@/models/User";

// POST /api/subscription - Create new subscription
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    // console.log("POST Body:", body);

    const newPlan = new Subscription(body);
    const saved = await newPlan.save();

    // After saving the subscription (newPlan.save())
    await User.findByIdAndUpdate(body.userId, {
      subscription: {
        plan: body.name,
        expiresAt: new Date(
          Date.now() + body.durationInDays * 24 * 60 * 60 * 1000
        ),
        transactionId: body.razorpay_payment_id,
      },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { message: "Failed to create", error: error.message },
      { status: 500 }
    );
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
    return NextResponse.json(
      { message: "Failed to fetch", error: error.message },
      { status: 500 }
    );
  }
}
