// models/admin.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'superadmin'], // Only allow 'admin' or 'superadmin'
    default: 'admin'              // Default role is 'admin'
  }
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export default Admin;
