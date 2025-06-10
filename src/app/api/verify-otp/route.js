import otpStore from "../../../lib/otpStore";
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import { createToken, setTokenCookie } from "../../../lib/auth";

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
    const storedOTP = otpStore.get(fullPhoneNumber); // Fixed typo from 'fullPhoneNumber' to 'fullPhoneNumber'

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

    await dbConnect();

    // Find or create user
    let user = await User.findOne({ phone: fullPhoneNumber });
    const isNewUser = !user;

    if (!user) {
      user = new User({
        phone: fullPhoneNumber,
        isVerified: false,
        phoneIsVerified: true
      });
      await user.save();
    } else {
      user.phoneIsVerified = true;
      if (!user.isVerified) user.isVerified = true;
      await user.save();
    }

    otpStore.delete(fullPhoneNumber);

    // Create session token
    const token = createToken(user._id);
    const response = NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      user: {
        id: user._id,
        phone: user.phone,
        isVerified: user.isVerified,
        phoneIsVerified: user.phoneIsVerified,
        isNewUser,
      }
    });

    // Set HTTP-only cookie
    setTokenCookie(response, token);

    return response;

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, error: "Error verifying OTP" },
      { status: 500 }
    );
  }
}