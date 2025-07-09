import dbConnect from "@/lib/db";
import User from "@/models/User";
import { calculateProfileCompletion } from "@/lib/profileCompletion";

export const GET = async (request) => {
  try {
    await dbConnect();

    // Find all users who have requested verification or are pending
    const potentialUsers = await User.find({
      isVerified: false,
      verificationStatus: { $in: ["Pending", "Unverified"] }
    }).select('-password');

    // Calculate completion percentage for each user and filter
    // const pendingUsers = potentialUsers.map(user => {
    //   const userObj = user.toObject();
    //   userObj.profileCompletion = calculateProfileCompletion(userObj);
    //   return userObj;
    // }).filter(user => user.profileCompletion >= 80); // Only include users with 80%+ completion
    console.log("Pending Users:", potentialUsers);
    if (!potentialUsers.length) {
      return new Response(JSON.stringify({ error: "No pending profiles found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ users: potentialUsers }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in pendingProfile API:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch pending profiles" }), {
      status: 500,
    });
  }
};