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

// export async function POST(req) {
//   try {
//     const { phoneNumber, otp } = await req.json();

//     // Input validation
//     if (!phoneNumber || phoneNumber.length !== 10 || !otp || otp.length !== 6) {
//       return new NextResponse(
//         JSON.stringify({ success: false, error: "Invalid phone number or OTP" }),
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     // Robust normalization: Cast to string, remove non-digits
//     const cleanDigits = String(phoneNumber).replace(/\D/g, '');
//     const fullPhoneNumber = `+91${phoneNumber}`; 

//     let storedOTP;

//     if (cleanDigits.endsWith('8080407364')) {
//        // Static OTP Bypass
//        if (otp.toString() === '123456') {
//          storedOTP = '123456';
//        } else {
//          return new NextResponse(
//             JSON.stringify({ success: false, error: "Invalid OTP" }),
//             { status: 400, headers: corsHeaders }
//          );
//        }
//     } else {
//        storedOTP = otpStore.get(fullPhoneNumber);
       
//        // Fallback: try checking clean number if raw failed
//        if (!storedOTP) {
//          storedOTP = otpStore.get(`+91${cleanDigits.slice(-10)}`);
//        }
//     }

//     // OTP verification
//     if (!storedOTP) {
//       return new NextResponse(
//         JSON.stringify({ success: false, error: "OTP expired or not sent" }),
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     if (storedOTP !== otp.toString()) {
//       return new NextResponse(
//         JSON.stringify({ success: false, error: "Invalid OTP" }),
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     await dbConnect();

//     // Find or create user
//     let user = await User.findOne({ phone: fullPhoneNumber });
//     const isNewUser = !user;

//     if (!user) {
//       user = new User({
//         phone: fullPhoneNumber,
//         isVerified: false,
//         phoneIsVerified: true,
//         lastLoginAt: new Date()
//       });
//       await user.save();
//     } else {
//       user.lastLoginAt = new Date();
//       user.phoneIsVerified = true;
//       if (!user.isVerified) user.isVerified = false;
//       await user.save();
//     }

//     otpStore.delete(fullPhoneNumber);

//     // Create session token
//     const token = createToken(user._id);
//     const response = new NextResponse(
//       JSON.stringify({
//         success: true,
//         message: "OTP verified successfully",
//         userId: user._id,
//         isNewUser,
//         user: {
//           phone: user.phone,
//           isVerified: user.isVerified,
//           phoneIsVerified: user.phoneIsVerified
//         }
//       }),
//       { headers: corsHeaders }
//     );

//     // Set HTTP-only cookie
//     setTokenCookie(response, token);

//     return response;

//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     return new NextResponse(
//       JSON.stringify({ success: false, error: "Error verifying OTP" }),
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// Add OPTIONS handler for preflight requests

export async function POST(req) {
  try {
    const { phoneNumber, otp } = await req.json();

    // Input validation
    if (!phoneNumber || !otp) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Invalid phone number or OTP" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Normalize phone
    const cleanDigits = String(phoneNumber).replace(/\D/g, "").slice(-10);
    const fullPhoneNumber = `+91${cleanDigits}`;
    const enteredOtp = otp.toString();

    let storedOTP;

    // ✅ STATIC OTP LOGIC
    if (cleanDigits === "8080407364") {
      storedOTP = "123456";  // force static OTP
    } else {
      // Existing dynamic OTP logic
      storedOTP = otpStore.get(fullPhoneNumber);

      // fallback lookup
      if (!storedOTP) {
        storedOTP = otpStore.get(`+91${cleanDigits}`);
      }
    }

    // OTP verification
    if (!storedOTP) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "OTP expired or not sent" }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (storedOTP !== enteredOtp) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Invalid OTP" }),
        { status: 400, headers: corsHeaders }
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
        phoneIsVerified: true,
        lastLoginAt: new Date()
      });
      await user.save();
    } else {
      user.lastLoginAt = new Date();
      user.phoneIsVerified = true;
      await user.save();
    }

    // delete only if it was dynamic OTP
    if (cleanDigits !== "8080407364") {
      otpStore.delete(fullPhoneNumber);
    }

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


export async function OPTIONS() {
  return new NextResponse(null, {
    headers: corsHeaders
  });
}