
const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending',
  },

  requestedAt: {
    type: Date,
    default: Date.now,
  },

  respondedAt: {
    type: Date,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

module.exports = mongoose.models.Connection || mongoose.model('Connection', connectionSchema);
