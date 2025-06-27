import mongoose from "mongoose";
const { Schema } = mongoose; // ✅ Destructure Schema from mongoose

const InterestSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, required: true },
  receiverId: { type: Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined','cancel'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Optional: Only delete if needed in dev environment
delete mongoose.models.Interest;

export default mongoose.models.Interest || mongoose.model('Interest', InterestSchema);
