const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const otps = await mongoose.connection.collection('otps').find({}).toArray();
  console.log("ALL OTPS IN DB:", otps);
  process.exit(0);
}
check();
//sample