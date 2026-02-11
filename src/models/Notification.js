import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["match", "like", "view", "interest", "system", "photo", "search", "info", "warning", "success"],
    default: "system",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: null, // For storing related ID (e.g., matchId, interestId)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model recompilation error in development
const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

export default Notification;
