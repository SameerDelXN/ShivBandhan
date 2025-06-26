// models/Interest.js

import mongoose from "mongoose";
const InterestSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  sentAt: { type: Date, default: Date.now }
});
delete mongoose.models.Interest; // Remove existing model if it exists
export default mongoose.models.User || mongoose.model('Interest', InterestSchema);
