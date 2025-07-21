import otpStore from "../../../lib/otpStore";
import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(req) {
  try {
    const { phoneNumber } = await req.json();
    if (!phoneNumber || phoneNumber.length !== 10) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid phone number" }), 
        { status: 400, headers: corsHeaders }
      );
    }

    const fullPhoneNumber = `+91${phoneNumber}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: fullPhoneNumber,
    });

    otpStore.set(fullPhoneNumber, otp);
    setTimeout(() => otpStore.delete(fullPhoneNumber), 5 * 60 * 1000);

    return new NextResponse(
      JSON.stringify({ success: true, message: "OTP sent successfully" }),
      { headers: corsHeaders }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Error sending OTP", error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: corsHeaders
  });
}

// import otpStore from "../../../lib/otpStore"; // Import shared store
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { phoneNumber } = await req.json();
//     if (!phoneNumber || phoneNumber.length !== 10) {
//       return NextResponse.json({ success: false, message: "Invalid phone number" }, { status: 400 });
//     }

//     const fullPhoneNumber = `+91${phoneNumber}`;
//     const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

//     // Send OTP via Fast2SMS
//     const fast2smsResponse = await fetch("https://www.fast2sms.com/dev/bulkV2", {
//       method: "POST",
//       headers: {
//         "Authorization": "0h9X16BZrCeKDiRTgA4YVtfJP3aFGqn7j5HEMuI8lSyUOmxws2l7f6XaQejAICDT1Znz20PEYsSbp5Jq",
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         route: "q",
//         "message" : otp,
//         numbers: phoneNumber
//       })
//     });

//     const responseData = await fast2smsResponse.json();

//     if (!responseData.return) {
//       throw new Error(responseData.message || "Failed to send OTP via Fast2SMS");
//     }

//     // Store OTP
//     otpStore.set(fullPhoneNumber, otp);
//     setTimeout(() => otpStore.delete(fullPhoneNumber), 5 * 60 * 1000); // Auto-expire in 5 mins

//     return NextResponse.json({ success: true, message: "OTP sent successfully" });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: "Error sending OTP", error: error.message }, { status: 500 });
//   }
// }
