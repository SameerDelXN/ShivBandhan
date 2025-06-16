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
  verificationRequested: {
  type: Boolean,
  default: false, // Profile verification request status
  description: "Indicates if user has requested profile verification"
  },
  verificationStatus: { 
  type: String,
  enum: ['Unverified', 'Pending', 'Verified', 'Rejected'],
  default: 'Unverified'
 },
  // Profile information
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', null],
    default: null
  },
  dob: Date, // Date of Birth
  height: String, 
  religion: String,
  currentCity: String,
  education: String,
  state: String,
  profilePhoto: String,
  maritalStatus:
   {
    type: String,
    enum: [ 'Unmarried', 'Divorced', 'Widowed', ],
    default: 'Unmarried'
  },
   motherTongue: 
   {
     type: String,
    enum:['Hindi', 'English', 'Marathi', null],
    default: null
   },
   caste: String,
   subCaste: String,
   gothra: String,
   fieldOfStudy: String,
   college: String,
   occupation: String,
   company: String,
   weight: String, 
   income:
    {
      type: String,
      enum: ['','₹5-10 Lakhs', '₹10-15 Lakhs', '₹15-20 Lakhs', null],
      default: null
  },

    
  
 
  
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
    showname: { type: Boolean, default: false },
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

delete mongoose.models.User; // Remove existing model if it exists
export default mongoose.models.User || mongoose.model('User', UserSchema);