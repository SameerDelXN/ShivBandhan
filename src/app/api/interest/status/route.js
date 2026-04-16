import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Interest from "@/models/Interest";
import User from "@/models/User";
import Notification from "@/models/Notification";
const getCorsHeaders = (req) => {
  const origin = req?.headers?.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin !== '*' ? origin : '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  };
};
export async function PATCH(req) {
  await connectDB();

  const { interestId, status } = await req.json();
  console.log("Interest ID:", interestId);
  console.log("Status:", status);
  if (!interestId || !["accepted", "declined"].includes(status)) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400, headers: getCorsHeaders(request) });
  }

  const interest = await Interest.findById(interestId);
  if (!interest) {
    return NextResponse.json({ message: "Interest not found" }, { status: 404, headers: getCorsHeaders(request) });
  }

  interest.status = status;
  await interest.save();

  // --- Notification Logic ---
  if (status === 'accepted') {
    try {
      const sender = await User.findById(interest.senderId);
      const receiver = await User.findById(interest.receiverId); // The one who accepted

      if (sender && receiver) {
        const receiverName = receiver.name || "A user";
        const title = "It's a Match!";
        const message = `${receiverName} accepted your interest!`;

        // 1. Create DB Notification
        await Notification.create({
          userId: sender._id,
          title,
          message,
          type: "match", // Using 'match' type for acceptance
          data: { interestId: interest._id, receiverId: receiver._id }
        });

        // 2. Send Push
        if (sender.pushToken) {
           console.log(`[API] Found push token for sender: ${sender.pushToken}`);
           const { sendPushNotification } = await import("@/lib/pushNotifications");
           await sendPushNotification(sender.pushToken, title, message, { type: 'match', interestId: interest._id });
        } else {
           console.log(`[API] NO push token found for sender ${sender._id}`);
        }
      }
    } catch (error) {
      console.error("[API] Error sending acceptance notification:", error);
    }
  }

  return NextResponse.json({ message: "Status updated", interest },{ headers: getCorsHeaders(request) });
}
// This route updates the status of an interest (accepted or declined).

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request)
  });
}
