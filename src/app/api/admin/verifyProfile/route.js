import dbConnect from "@/lib/db";
import User from "@/models/User";

export const POST = async (request) => {
  try {
    const { userId, action } = await request.json();

    await dbConnect();

    let updateData = {};
    if (action === "Verified") {
      updateData = {
        isVerified: true,
        verificationStatus: "Verified",
        verificationRequested: false
      };
    } else if (action === "Rejected") {
      updateData = {
        isVerified: false,
        verificationStatus: "Rejected",
        verificationRequested: false
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: `User ${action} successfully` }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update verification status" }), {
      status: 500,
    });
  }
};