const mongoose = require('mongoose');

// Mock User model to match the schema
const UserSchema = new mongoose.Schema({
  phone: String,
  name: String,
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const URI = 'mongodb+srv://sameer:sameer@cluster0.0uf3e89.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function verify() {
  try {
    await mongoose.connect(URI);
    console.log('Connected to DB');
    
    // Find a few users to see the phone format
    const users = await User.find({}).limit(20);
    console.log('\n--- Sample Users ---');
    users.forEach(u => {
      console.log(`[${u.phone}] - ${u.name}`);
    });

    // Check if there are any users WITHOUT +91
    const usersWithoutPrefix = await User.find({ phone: { $not: /^\+91/ } });
    console.log(`\nUsers without +91: ${usersWithoutPrefix.length}`);
    usersWithoutPrefix.forEach(u => {
      console.log(`[${u.phone}] - ${u.name}`);
    });

    // Check for a specific pattern (e.g. 10 digits only)
    const tenDigitsOnly = await User.find({ phone: /^\d{10}$/ });
    console.log(`\n10 digits only: ${tenDigitsOnly.length}`);


    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

verify();
