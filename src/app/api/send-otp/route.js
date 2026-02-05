// import otpStore from "../../../lib/otpStore";
// import { NextResponse } from "next/server";
// import twilio from "twilio";
 
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
 
// // Define CORS headers
// const corsHeaders = {
//   'Access-Control-Allow-Origin': 'http://localhost:8081',
//   'Access-Control-Allow-Methods': 'POST, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type',
//   'Access-Control-Allow-Credentials' : true,
// };
 
// export async function POST(req) {
//   try {
//     const { phoneNumber } = await req.json();
//     if (!phoneNumber || phoneNumber.length !== 10) {
//       return new NextResponse(
//         JSON.stringify({ success: false, message: "Invalid phone number" }),
//         { status: 400, headers: corsHeaders }
//       );
//     }
 
//     const fullPhoneNumber = `+91${phoneNumber}`;
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
 
//     await client.messages.create({
//       body: `Your OTP is ${otp}`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: fullPhoneNumber,
//     });
 
//     otpStore.set(fullPhoneNumber, otp);
//     setTimeout(() => otpStore.delete(fullPhoneNumber), 5 * 60 * 1000);
 
//     return new NextResponse(
//       JSON.stringify({ success: true, message: "OTP sent successfully" }),
//       { headers: corsHeaders }
//     );
//   } catch (error) {
//     return new NextResponse(
//       JSON.stringify({ success: false, message: "Error sending OTP", error: error.message }),
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }
 
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     headers: corsHeaders
//   });
// }
 
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
 
export async function POST(req) {
  try {
    const { phoneNumber } = await req.json();
    if (!phoneNumber || phoneNumber.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      );
    }
 
    const fullPhoneNumber = `+91${phoneNumber}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Send OTP via Fast2SMS (DLT template)
    const fast2smsResponse = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        Authorization: process.env.FAST2SMS_API_KEY, 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "dlt",
        sender_id: "SHVBDN", 
        message: "197321",   
        variables_values: otp, 
        numbers: phoneNumber,  
      }),
    });
 
    const responseData = await fast2smsResponse.json();
 
    if (!responseData.return) {
      throw new Error(responseData.message || "Failed to send OTP via Fast2SMS");
    }
 
    // Store OTP in Database
    await dbConnect();
    
    let user = await User.findOne({ phone: fullPhoneNumber });
    
    if (!user) {
        // Create new user with OTP
        user = await User.create({
            phone: fullPhoneNumber,
            otp: otp,
            otpExpiresAt: otpExpiresAt,
            isVerified: false,
            phoneIsVerified: false
        });
    } else {
        // Update existing user with new OTP
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();
    }
 
    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { success: false, message: "Error sending OTP", error: error.message },
      { status: 500 }
    );
  }
}