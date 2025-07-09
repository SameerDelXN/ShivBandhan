import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // Basic information

  name: String,
  phone: { 
  type: String, 
    unique: true, 
    profilePhoto:{
      type:String
    },
  profileCompletion: { type: Number, default: 0 },
    // validate: {
    //   validator: function(v) {
    //     return /^\+91\d{10}$/.test(v); // Validates Indian phone numbers with +91 prefix
    //   },
    //   message: props => `${props.value} is not a valid Indian phone number!`
    // }
  },

  // Verification status
  isVerified: {
    type: Boolean,
    default: false, // Overall account verification status
    description:
      "Indicates if the user has completed full profile verification",
  },
  phoneIsVerified: {
    type: Boolean,
    default: false, // Specific phone verification status
    description: "Indicates if the phone number has been verified via OTP",
  },
  verificationRequested: {
    type: Boolean,
    default: false, // Profile verification request status
    description: "Indicates if user has requested profile verification",
  },
  verificationStatus: {
    type: String,
    enum: ["Unverified", "Pending", "Verified", "Rejected"],
    default: "Unverified",
  },
  profileCompletion: { 
  type: Number, 
  default: 0,
  min: 0,
  max: 100 
},
  // Profile information
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", null],
    default: null,
  },
  dob: Date, // Date of Birth
  height: String,
  religion: String,
  currentCity: String,
  education: String,
  
  profilePhoto: String,
  maritalStatus: {
    type: String,
    enum: ["Unmarried", "Divorced", "Widowed"],
    default: "Unmarried",
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
   permanentAddress: String,
   complexion: String,

   income:
    {
      type: String,
      enum: ['','₹5-10 Lakhs', '₹10-15 Lakhs', '₹15-20 Lakhs', null],
      default: null
  },
    email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  bloodGroup: {
    type: String,
    // enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null],
    default: null
  },
  wearsLens: {
    type: Boolean,
    default: false
  },
   // Relative Info
  fatherName: String,
  parentResidenceCity: String,
  mother: String,
  brothers: { type: Number, default: 0 },
  marriedBrothers: { type: Number, default: 0 },
  sisters: { type: Number, default: 0 },
  marriedSisters: { type: Number, default: 0 },
  nativeDistrict: String,
  nativeCity: String,
  familyWealth: String,
  relativeSurname: {
  type: [String], 
},
  parentOccupation: String,
  mamaSurname: String,

  // Horoscope Info
  rashi: String,
  nakshira: String,
  charan: String,
  gan: String,
  nadi: String,
  mangal: { type: Boolean, default: false },
  birthPlace: String,
  birthTime: String,
  gotraDevak: String,

  // Expectations
  expectedCaste: String,
  preferredCity: String,
  expectedAgeDifference: String,
  expectedEducation: String,
  divorcee: { type: Boolean, default: false },
  expectedHeight: String,
  expectedIncome: String,

    // Preferences
  preferences: {
    ageRange: {
      min: { type: Number, min: 18, max: 100 },
      max: { type: Number, min: 18, max: 100 },
    },
    religion: String,
    caste: String,
    city: String,
  },

  // Privacy settings
  privacySettings: {
    showname: { type: Boolean, default: false },
    showPhoto: { type: Boolean, default: false },
    showContact: { type: Boolean, default: false },
  },

  // Subscription
 subscription: {
  plan: {
    type: String,
    default: 'free'
  },
  isSubscribed: {
    type: Boolean,
    default: false, // Indicates if the user has an active subscription
  },
  expiresAt: Date,
  transactionId: String, // ID from payment gateway
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
  },
},

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLoginAt: Date,


  //form fillup option for user 
   profileSetup: {
  willAdminFill: Boolean,  // true if admin should fill, false if user will fill
  dontAskAgain: Boolean,   // true if we shouldn't show popup again
 
},
});

delete mongoose.models.User; // Remove existing model if it exists
export default mongoose.models.User || mongoose.model("User", UserSchema);
