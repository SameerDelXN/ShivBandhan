import otpStore from "../../../lib/otpStore"; // Import shared store
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phoneNumber, otp } = await req.json();

    console.log("Received phone number:", phoneNumber);
    console.log("Received OTP:", otp);

    if (!phoneNumber || phoneNumber.length !== 10 || !otp || otp.length !== 6) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number or OTP" },
        { status: 400 }
      );
    }

    const fullPhoneNumber = `+91${phoneNumber}`;
    const storedOTP = otpStore.get(fullPhoneNumber);

    console.log("Stored OTP:", storedOTP);

    if (!storedOTP) {
      return NextResponse.json(
        { success: false, error: "OTP expired or not sent" },
        { status: 400 }
      );
    }

    if (storedOTP !== otp.toString()) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP" },
        { status: 400 }
      );
    }

    otpStore.delete(fullPhoneNumber); // Remove OTP after successful verification
    console.log("OTP Verified Successfully!");

    return NextResponse.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, error: "Error verifying OTP" },
      { status: 500 }
    );
  }
}
