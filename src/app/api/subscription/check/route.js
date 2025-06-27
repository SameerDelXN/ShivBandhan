// // src/app/api/subscription/check/route.js
// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import Subscription from "@/models/Subscription";

// export async function GET(req) {
//   try {
//     await connectDB();
    
//     // Get user ID from query parameters
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get('userId');

//     if (!userId) {
//       return NextResponse.json(
//         { error: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     // Check if user has any active subscription
//     const activeSubscription = await Subscription.findOne({
//       userId,
//       isActive: true
//     });

//     return NextResponse.json({
//       hasActiveSubscription: activeSubscription
// });
//   } catch (error) {
//     console.error("Subscription check error:", error);
//     return NextResponse.json(
//       { error: "Failed to check subscription status" },
//       { status: 500 }
//     );
//   }
// }