import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Interest from "@/models/Interest";
import User from "@/models/User"; // Import User model

export async function POST(req) {
  try {
    await connectDB();
    const { senderId, receiverId } = await req.json();
    console.log("Sender ID:", senderId);
    console.log("Receiver ID:", receiverId);
    // Validate input
    if (!senderId || !receiverId) {
      return NextResponse.json(
        { message: "Both senderId and receiverId are required" },
        { status: 400 }
      );
    }

    // Check if users exist
    const senderExists = await User.findById(senderId);
    const receiverExists = await User.findById(receiverId);
    
    if (!senderExists || !receiverExists) {
      return NextResponse.json(
        { message: "Either sender or receiver does not exist" },
        { status: 404 }
      );
    }

    // Check for existing interest
    const existing = await Interest.findOne({ senderId, receiverId });
    if (existing) {
      return NextResponse.json(
        { message: "Interest already sent" },
        { status: 400 }
      );
    }

    // Create new interest
    const interest = new Interest({ senderId, receiverId });
    await interest.save();

    return NextResponse.json({ 
      message: "Interest sent successfully",
      interest: {
        ...interest._doc,
        sender: senderExists,
        receiver: receiverExists
      }
    });

  } catch (error) {
    console.error("Error in POST interest:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Find all interests where the user is the sender
    const interests = await Interest.find({ senderId: userId });

    // Populate sender and receiver details
    const populatedInterests = await Promise.all(
      interests.map(async (interest) => {
        const sender = await User.findById(interest.senderId).select('-password'); // Exclude sensitive data
        const receiver = await User.findById(interest.receiverId).select('-password');
        return {
          ...interest._doc,
          sender,
          receiver
        };
      })
    );

    return NextResponse.json({ 
      success: true,
      interests: populatedInterests 
    });

  } catch (error) {
    console.error("Error in GET interests:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}