// src/lib/cron.js
import cron from "node-cron";
import connectDB from "./dbConnect";
import User from "@/models/User";

const checkExpiredSubscriptions = async () => {
  try {
    await connectDB();
    const currentDate = new Date();
    const result = await User.updateMany(
      {
        "subscription.isSubscribed": true,
        "subscription.expiresAt": { $lte: currentDate },
      },
      {
        $set: {
            "subscription.subscriptionId": null,
          "subscription.isSubscribed": false,
          "subscription.plan": "free",
        },
      }
    );
    console.log(`Expired subscriptions updated: ${result.modifiedCount} users affected`);
  } catch (error) {
    console.error("Error in cron job:", error);
  }
};

// Schedule to run every day at midnight
cron.schedule("0 0 * * *", checkExpiredSubscriptions);

export default checkExpiredSubscriptions;