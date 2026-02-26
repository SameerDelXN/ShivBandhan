import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Automatically delete document after 5 minutes (300 seconds)
  }
});

// Remove existing model if it exists to prevent OverwriteModelError in Next.js hot reload
export default mongoose.models.OTP || mongoose.model("OTP", OTPSchema);
