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

import otpStore from "../../../lib/otpStore"; 
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phoneNumber } = await req.json();
    if (!phoneNumber || phoneNumber.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      );
    }

    const cleanPhone = phoneNumber.replace(/\s+/g, ''); // Remove spaces for checking

    let otp;
    let smsSent = true; // Assume SMS is sent unless explicitly skipped or failed

    if (cleanPhone === '8080407364') {
      otp = '123456';
      console.log(`Using static OTP for ${cleanPhone}: ${otp}`);
      smsSent = true; // Mark as sent for static OTP, as no actual SMS is expected
    } else {
      otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Send OTP via Fast2SMS (DLT template)
      try {
        const fast2smsResponse = await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            Authorization: process.env.FAST2SMS_API_KEY, // ✅ keep in .env
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            route: "dlt",
            sender_id: "SHVBDN", // Your approved sender id
            message: "197321",   // 👈 Your template_id (replace with yours)
            variables_values: otp, // OTP fills {#var#}
            numbers: phoneNumber,  // Send without +91
          }),
        });

        const responseData = await fast2smsResponse.json();

        if (!responseData.return) {
          console.error("Fast2SMS Error:", responseData);
          smsSent = false;
          throw new Error(responseData.message || "Failed to send OTP via Fast2SMS");
        }
      } catch (error) {
        console.error("SMS Send Error:", error);
        smsSent = false;
        throw error; // Re-throw to be caught by the outer catch block
      }
    }

    if (!smsSent && cleanPhone !== '8080407364') {
      return NextResponse.json({ success: false, message: "Failed to send SMS" }, { status: 500 });
    }

    // Store OTP in memory
    const fullPhoneNumber = `+91${phoneNumber}`;
    otpStore.set(fullPhoneNumber, otp);
    setTimeout(() => otpStore.delete(fullPhoneNumber), 5 * 60 * 1000);

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error sending OTP", error: error.message },
      { status: 500 }
    );
  }
}
