// models/Interest.js

import mongoose from "mongoose";
const InterestSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, },
  receiverId: { type: mongoose.Schema.Types.ObjectId,  },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  sentAt: { type: Date, default: Date.now }
});
delete mongoose.models.Interest; // Remove existing model if it exists
export default mongoose.models.Interest || mongoose.model('Interest', InterestSchema);