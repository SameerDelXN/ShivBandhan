const fs = require('fs');
const path = require('path');
const files = [
  'verify-otp/route.js',
  'users/update/route.js',
  'users/fetchAllUsers/route.js',
  'users/me/route.js',
  'send-otp/route.js',
  'interest/status/route.js',
  'interest/send/route.js',
  'interest/received/route.js'
];
files.forEach(f => {
  const p = path.join('c:/Users/Admin/shiv-bandhan/ShivBandhan/src/app/api', f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    
    // Check if GET/POST exists
    if (!content.includes('export async function OPTIONS')) {
      content += `\n\nexport async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request)
  });
}\n`;
      fs.writeFileSync(p, content);
      console.log("Added OPTIONS to " + f);
    }
  }
});
