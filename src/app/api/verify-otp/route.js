import otpStore from "../../../lib/otpStore";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { createToken, setTokenCookie } from "@/lib/auth";
 
// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8081', // Or your specific origin
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials' : true,
};
 
export async function POST(req) {
  try {
    const { phoneNumber, otp } = await req.json();
 
    // Input validation
    if (!phoneNumber || phoneNumber.length !== 10 || !otp || otp.length !== 6) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Invalid phone number or OTP" }),
        { status: 400, headers: corsHeaders }
      );
    }
 
    const fullPhoneNumber = `+91${phoneNumber}`;
 
    await dbConnect();
 
    // Find user with OTP fields explicitly selected
    let user = await User.findOne({ phone: fullPhoneNumber }).select("+otp +otpExpiresAt");
 
    if (!user || !user.otp || !user.otpExpiresAt) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "OTP expired or not sent" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Check expiration
    if (new Date() > user.otpExpiresAt) {
        return new NextResponse(
            JSON.stringify({ success: false, error: "OTP has expired" }),
            { status: 400, headers: corsHeaders }
        );
    }
 
    // OTP verification
    if (user.otp !== otp.toString()) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Invalid OTP" }),
        { status: 400, headers: corsHeaders }
      );
    }
 
    // OTP is valid
    // Clear OTP fields
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    
    // Update verification status
    user.lastLoginAt = new Date();
    user.phoneIsVerified = true;
    if (!user.isVerified) user.isVerified = false;
    
    await user.save();
    
    const isNewUser = false; // Logic for new user detection can be refined if needed based on creation time or other flags
 
    // Create session token
    const token = createToken(user._id);
    const response = new NextResponse(
      JSON.stringify({
        success: true,
        message: "OTP verified successfully",
        userId: user._id,
        isNewUser,
        user: {
          phone: user.phone,
          isVerified: user.isVerified,
          phoneIsVerified: user.phoneIsVerified
        }
      }),
      { headers: corsHeaders }
    );
 
    // Set HTTP-only cookie
    setTokenCookie(response, token);
 
    return response;
 
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return new NextResponse(
      JSON.stringify({ success: false, error: "Error verifying OTP" }),
      { status: 500, headers: corsHeaders }
    );
  }
}
 
// Add OPTIONS handler for preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: corsHeaders
  });
}
 