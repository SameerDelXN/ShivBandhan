const mongoose = require('mongoose');

const partnerPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Each user has one preference set
  },

  // Basic Info
  preferredAge: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  preferredHeight: {
    min: { type: Number }, // in cm
    max: { type: Number },
  },
  maritalStatus: {
    type: [String],
    enum: ['Never Married', 'Divorced', 'Widowed', 'Separated'],
    default: ['Never Married'],
  },

  // Religion & Caste
  religion: { type: [String], default: [] },
  caste: { type: [String], default: [] },

  // Location Preferences
  country: { type: [String], default: [] },
  state: { type: [String], default: [] },
  city: { type: [String], default: [] },

  // Education & Profession
  education: { type: [String], default: [] },
  profession: { type: [String], default: [] },
  incomeRange: {
    min: { type: Number },
    max: { type: Number },
  },

  // Lifestyle
  diet: {
    type: [String],
    enum: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'],
    default: [],
  },
  smoking: {
    type: [String],
    enum: ['Yes', 'No', 'Occasionally'],
    default: [],
  },
  drinking: {
    type: [String],
    enum: ['Yes', 'No', 'Occasionally'],
    default: [],
  },

  // Additional filters
  allowDivorced: { type: Boolean, default: false },
  onlyVerifiedProfiles: { type: Boolean, default: false },
  onlyPremiumProfiles: { type: Boolean, default: false },

  // Keywords or user-defined tags
  keywords: { type: [String], default: [] },
}, {
  timestamps: true,
});

module.exports = mongoose.models.PartnerPreference || mongoose.model('PartnerPreference', partnerPreferenceSchema);
