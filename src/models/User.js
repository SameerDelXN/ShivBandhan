import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // Basic information
  name: String,
  phone: { 
    type: String, 
    unique: true, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\+91\d{10}$/.test(v); // Validates Indian phone numbers with +91 prefix
      },
      message: props => `${props.value} is not a valid Indian phone number!`
    }
  },
  
  // Verification status
  isVerified: { 
    type: Boolean, 
    default: false, // Overall account verification status
    description: "Indicates if the user has completed full profile verification"
  },
  phoneIsVerified: { 
    type: Boolean, 
    default: false, // Specific phone verification status
    description: "Indicates if the phone number has been verified via OTP"
  },

  // Profile information
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', null],
    default: null
  },
  dob: Date,
  religion: String,
  caste: String,
  education: String,
  city: String,
  state: String,
  profilePhoto: String,
  
  // Preferences
  preferences: {
    ageRange: {
      min: { type: Number, min: 18, max: 100 },
      max: { type: Number, min: 18, max: 100 }
    },
    religion: String,
    caste: String,
    city: String
  },
  
  // Privacy settings
  privacySettings: {
    showFullName: { type: Boolean, default: false },
    showPhoto: { type: Boolean, default: false },
    showContact: { type: Boolean, default: false }
  },
  
  // Subscription
  subscription: {
    plan: {
      type: String,
      enum: ['Free', 'Basic', 'Premium', null],
      default: null
    },
    expiresAt: Date
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLoginAt: Date
});


export default mongoose.models.User || mongoose.model('User', UserSchema);