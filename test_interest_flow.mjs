
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
// import fetch from 'node-fetch'; // Built-in fetch used

// Configuration
const MONGODB_URI = "mongodb+srv://sameer:sameer@cluster0.0uf3e89.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = "shivbandhan1234139";
const BASE_URL = "http://localhost:3000";

// Define User Schema minimal for creation
const UserSchema = new mongoose.Schema({
  name: String,
  phone: String,
  pushToken: String,
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function runTest() {
  console.log("--- Starting Interest Flow Test ---");

  try {
    // 1. Connect to DB
    if (!mongoose.connection.readyState) {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
    }

    // 2. Create Two Fake Users
    const sender = await User.create({
        name: "Test Sender",
        phone: "+919999999998",
        pushToken: "ExponentPushToken[TestSenderToken123]" 
    });
    const receiver = await User.create({
        name: "Test Receiver",
        phone: "+919999999999",
        pushToken: "ExponentPushToken[TestReceiverToken456]"
    });

    console.log(`Created Users: Sender(${sender._id}), Receiver(${receiver._id})`);

    // 3. Generate Token for Sender (to send interest) and Receiver (to accept)
    const senderToken = jwt.sign({ userId: sender._id }, JWT_SECRET, { expiresIn: '1h' });
    const receiverToken = jwt.sign({ userId: receiver._id }, JWT_SECRET, { expiresIn: '1h' });

    // 4. Send Interest (Sender -> Receiver)
    console.log("\n--- Sending Interest ---");
    const sendRes = await fetch(`${BASE_URL}/api/interest/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${senderToken}` },
        body: JSON.stringify({ senderId: sender._id, receiverId: receiver._id })
    });
    const sendData = await sendRes.json();
    console.log(`Status: ${sendRes.status}`);
    console.log(`Response: ${JSON.stringify(sendData)}`);

    if (sendRes.status !== 200) {
        throw new Error("Failed to send interest");
    }

    // 5. Accept Interest (Receiver accepts Sender's interest)
    // We need the interest ID from the response or query it
    const interestId = sendData.interest._id || sendData.interest.id;
    console.log(`Interest ID: ${interestId}`);

    console.log("\n--- Accepting Interest ---");
    const acceptRes = await fetch(`${BASE_URL}/api/interest/status`, {
        method: "PATCH", // Ensure it matches the route (PATCH)
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${receiverToken}` },
        body: JSON.stringify({ interestId: interestId, status: "accepted" })
    });
    const acceptData = await acceptRes.json();
    console.log(`Status: ${acceptRes.status}`);
    console.log(`Response: ${JSON.stringify(acceptData)}`);

    if (acceptRes.status !== 200) {
        throw new Error("Failed to accept interest");
    }

    console.log("\n--- SUCCESS: Flow Completed ---");
    console.log("Check backend logs for [Push] messages for both actions.");

  } catch (error) {
    console.error("Test Failed:", error);
  } finally {
      // Cleanup
      if (mongoose.connection.readyState) {
          // Ideally delete created users, but for investigating logs we might keep them briefly or delete here
          // await User.deleteMany({ name: { $in: ["Test Sender", "Test Receiver"] } });
          // console.log("Cleaned up test users");
          await mongoose.disconnect();
      }
  }
}

runTest();
