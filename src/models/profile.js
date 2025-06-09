const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  // Personal Info
  name: { type: String, 
  required: true, 
  trim: true },

  gender: { type: String, 
  enum: ['Male', 'Female', 'Other'], 
  required: true },

  age: { type: Number,
  required: true },

  height: { type: Number }, // in cm
  weight: { type: String },
  medical_status: { type: String,
    default: ' ',
  },

  maritalStatus: {
    type: String,
    enum: ['Never Married', 'Divorced', 'Widowed', 'Separated'],
    default: 'Never Married',
  },

  // Religion & Caste
  religion: { type: String, required: true },
  caste: { type: String, required: true },

  // Astrology
  dateOfBirth: { type: Date },
  timeOfBirth: { type: String },
  placeOfBirth: { type: String },
  manglik: { type: Boolean, default: false },
  zodiacSign: { type: String },

  // Education & Career
  education: { type: String, required: true },
  profession: { type: String, required: true },
  income: { type: String },

  // Location
  location: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
  },

  // Family Info
  fatherName: { type: String },
  fatherOccupation: { type: String },
  motherName: { type: String },
  motherOccupation: { type: String },
  siblings: { type: Number },
  familyType: { type: String, enum: ['Joint', 'Nuclear'] },

  familyLocation: {
    country: { type: String },
    state: { type: String },
    city: { type: String },
  },

  // Lifestyle
  diet: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'],
    default: 'Vegetarian',
  },
  smoking: { type: String, enum: ['Yes', 'No', 'Occasionally'], default: 'No' },
  drinking: { type: String, enum: ['Yes', 'No', 'Occasionally'], default: 'No' },

  // About Me
  bio: { type: String, default: '', maxlength: 1000 },
  hobbies: {
   type: [String], // array of strings
    default: [],
    validate: {
      validator: function (arr) {
      return arr.every(hobby => hobby.length <= 50);
      },
      message: 'Each hobby must be 50 characters or less.',
    },
  },


  // Media
  profilePicture: { type: String },
  gallery: [String],
  profilePictureStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },

  // Matchmaking
  isProfileComplete: { type: Boolean, default: false },
  lastActive: { type: Date },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sentInterests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  receivedInterests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Privacy & Controls
  hideProfileFromSearch: { type: Boolean, default: false },
  visibleTo: {
    type: String,
    enum: ['All', 'Same Religion', 'Premium Only'],
    default: 'All',
  },

  contactVisibility: {
    type: String,
    enum: ['Everyone', 'Accepted Matches Only'],
    default: 'Everyone',
  },

  // Status & Admin
  isVerifiedProfile: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  premiumExpiresAt: { type: Date },
  canReceiveInterest: { type: Boolean, default: true },
  reportCount: { type: Number, default: 0 },
  

  // Search & Meta
  searchTags: [String],
  profileViews: { type: Number, default: 0 },
  referralCode: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
