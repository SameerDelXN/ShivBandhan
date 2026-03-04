const mongoose = require('mongoose');

// Read from .env
require('dotenv').config({ path: '.env.local' });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB");
  
  const FormSection = require('./src/models/FormSection').default || require('./src/models/FormSection');
  
  const sections = await FormSection.find();
  console.log('Found total sections:', sections.length);
  
  const unique = new Map();
  const toKeep = [];
  const toDelete = [];
  
  sections.forEach(s => {
    if (!unique.has(s.label)) {
      unique.set(s.label, true);
      toKeep.push(s._id);
    } else {
      toDelete.push(s._id);
    }
  });
  
  if (toDelete.length > 0) {
    await FormSection.deleteMany({ _id: { $in: toDelete } });
    console.log(`Deleted ${toDelete.length} duplicate sections`);
  } else {
    console.log('No duplicates found in DB');
  }

  // Double check how many are left
  const remaining = await FormSection.find();
  console.log('Remaining sections:', remaining.length);
  remaining.forEach(r => console.log(' -', r.label));
  
  mongoose.disconnect();
}

main().catch(console.error);
