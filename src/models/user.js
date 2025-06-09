const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

 
}, {
  timestamps: true,
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
