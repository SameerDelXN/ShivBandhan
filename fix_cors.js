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
    
    // Replace the static corsHeaders block with a dynamic function arrow notation
    content = content.replace(/const corsHeaders = {[\s\S]*?};/, 
      `const getCorsHeaders = (req) => {
  const origin = req?.headers?.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin !== '*' ? origin : '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  };
};`
    );

    // Replace the usage of corsHeaders
    content = content.replace(/{ status: ([0-9]+)\s*,\s*headers:\s*corsHeaders\s*}/g, '{ status: $1, headers: getCorsHeaders(request) }');
    content = content.replace(/{status:\s*([0-9]+)\s*,\s*headers:\s*corsHeaders\s*}/g, '{ status: $1, headers: getCorsHeaders(request) }');
    content = content.replace(/{\s*headers:\s*corsHeaders\s*}/g, '{ headers: getCorsHeaders(request) }');
    
    fs.writeFileSync(p, content);
    console.log("Updated " + f);
  }
});
