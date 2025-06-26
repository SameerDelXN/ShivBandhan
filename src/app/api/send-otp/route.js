import otpStore from "../../../lib/otpStore"; // Import shared store
import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req) {
  try {
    const { phoneNumber } = await req.json();
    if (!phoneNumber || phoneNumber.length !== 10) {
      return NextResponse.json({ success: false, message: "Invalid phone number" }, { status: 400 });
    }

    const fullPhoneNumber = `+91${phoneNumber}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: fullPhoneNumber,
    });

    // Store OTP
    otpStore.set(fullPhoneNumber, otp);
    setTimeout(() => otpStore.delete(fullPhoneNumber), 5 * 60 * 1000); // Auto-expire in 5 mins

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error sending OTP", error: error.message }, { status: 500 });
  }
}
