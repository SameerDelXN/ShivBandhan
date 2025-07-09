// models/FormSection.js
import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  name: String,
  label: String,
  type: { type: String, enum: ['text', 'number', 'select', 'date', 'checkbox', 'textarea'] },
  required: Boolean,
  options: [String], // For select fields
  placeholder: String,
  order: Number
});

const sectionSchema = new mongoose.Schema({
  name: String,
  label: String,
  icon: String,
  order: Number,
  fields: [fieldSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Check if the model already exists before defining it
export default mongoose.models.FormSection || mongoose.model('FormSection', sectionSchema);