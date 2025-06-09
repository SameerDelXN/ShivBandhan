
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  content: {
    type: String,
    required: true,
    maxlength: 2000,
  },

  sentAt: {
    type: Date,
    default: Date.now,
  },

  read: {
    type: Boolean,
    default: false,
  },

  // Optional: if you want to support message threads or replies
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null,
  }
}, {
  timestamps: true,  // adds createdAt and updatedAt
});

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);
