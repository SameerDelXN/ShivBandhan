/**
 * One-time migration script to backfill shivbandhanId for existing users.
 * Run: node backfill_shivbandhan_ids.js
 */
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Parse .env.local manually (no dotenv dependency)
const envPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8").split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) return;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  });
}

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const db = mongoose.connection.db;
  const usersCol = db.collection("users");
  const countersCol = db.collection("counters");

  // Find all users without a shivbandhanId, sorted by creation date
  const users = await usersCol
    .find({ $or: [{ shivbandhanId: { $exists: false } }, { shivbandhanId: null }] })
    .sort({ createdAt: 1 })
    .toArray();

  console.log(`📋 Found ${users.length} users without shivbandhanId`);

  if (users.length === 0) {
    console.log("✅ Nothing to backfill.");
    await mongoose.disconnect();
    return;
  }

  // Get the current counter value (or start from 0)
  const existing = await countersCol.findOne({ _id: "shivbandhanId" });
  let seq = existing ? existing.seq : 0;

  for (const user of users) {
    seq++;
    const shivbandhanId = `SHIVBANDHAN${String(seq).padStart(3, "0")}`;
    await usersCol.updateOne(
      { _id: user._id },
      { $set: { shivbandhanId } }
    );
    console.log(`  ✅ ${user.name || user.phone} → ${shivbandhanId}`);
  }

  // Update the counter to match
  await countersCol.updateOne(
    { _id: "shivbandhanId" },
    { $set: { seq } },
    { upsert: true }
  );

  console.log(`\n🎉 Done! Assigned IDs to ${users.length} users. Counter set to ${seq}.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
