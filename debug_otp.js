
const mongoose = require('mongoose');

// Need to find the connection string. I'll check .env first.
const fs = require('fs');
const dotenv = require('dotenv');

async function debug() {
    try {
        const envFile = fs.readFileSync('d:/Shivbandhan/ShivBandhan/.env', 'utf8');
        const config = dotenv.parse(envFile);
        const mongoUri = config.MONGODB_URI;

        if (!mongoUri) {
            console.error("MONGODB_URI not found in .env");
            return;
        }

        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB");

        const OTPSchema = new mongoose.Schema({
            phone: String,
            otp: String,
            createdAt: Date
        });

        const OTP = mongoose.models.OTP || mongoose.model("OTP", OTPSchema);

        const latestOTPs = await OTP.find().sort({ createdAt: -1 }).limit(5);
        console.log("Latest OTPs in DB:");
        latestOTPs.forEach(otp => {
            console.log(`Phone: ${otp.phone}, OTP: ${otp.otp}, CreatedAt: ${otp.createdAt}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error("Debug failed:", err);
    }
}

debug();
