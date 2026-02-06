import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/Notification";
import User from "@/models/User";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow all origins for mobile app
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request) {
  try {
    await dbConnect();

    // 1. Extract Token (Support Header or Cookie)
    let token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
        token = request.cookies.get("authToken")?.value;
    }

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401, headers: corsHeaders }
      );
    }

    // 2. Verify Token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401, headers: corsHeaders }
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 401, headers: corsHeaders }
      );
    }

    const userId = decoded.userId;

    // 3. Fetch Notifications
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }) // Newest first
      .limit(50); // Limit to last 50 notifications

    return NextResponse.json(
      {
        success: true,
        count: notifications.length,
        notifications,
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Optional: POST to create a notification (for testing or internal logic)
export async function POST(request) {
  try {
    await dbConnect();
    // Simple auth check - maybe only allow from verified users or system? 
    // For now, let's keep it open or same token check if needed.
    // Assuming this is used by system or admin, typically restricted.
    // For simplicity, we'll just allow it for now but in real app secure this.
    
    // Extract Token (Support Header or Cookie)
    let token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
        token = request.cookies.get("authToken")?.value;
    }
     if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }
    
     let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401, headers: corsHeaders });
    }


    const body = await request.json();
    const { userId, title, message, type, data } = body;

    if (!userId || !message) {
      return NextResponse.json(
        { message: "Missing required fields: userId, message" },
        { status: 400, headers: corsHeaders }
      );
    }

    const newNotification = await Notification.create({
      userId,
      title: title || "New Notification",
      message,
      type: type || "system",
      data,
    });

    // Send Push Notification
    try {
      const user = await User.findById(userId);
      if (user && user.pushToken && user.pushToken.startsWith('ExponentPushToken')) {
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: user.pushToken,
            sound: 'default',
            title: title || "Shivbandhan",
            body: message,
            data: data || {},
          }),
        });
        console.log("Push notification sent to", userId);
      }
    } catch (pushError) {
      console.error("Failed to send push notification:", pushError);
      // Don't fail the request if push fails, just log it
    }

    return NextResponse.json(
      { success: true, notification: newNotification },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
     console.error("Error creating notification:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
