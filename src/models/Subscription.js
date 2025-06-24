// models/Subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  durationInDays: { type: Number, required: true },
  features: [String],

}, { timestamps: true });

export default mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);
