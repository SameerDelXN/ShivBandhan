import mongoose from 'mongoose';

const PendingOTPSchema = new mongoose.Schema({
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
    expires: 300, // document expires after 5 minutes
  },
});

export default mongoose.models.PendingOTP || mongoose.model('PendingOTP', PendingOTPSchema);
