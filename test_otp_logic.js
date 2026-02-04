
const testCases = [
  "8080407364",
  "80804 07364",
  "+91 8080407364",
  "+91 80804 07364",
  "918080407364",
  "  8080407364  "
];

testCases.forEach(phoneNumber => {
  const normalizedPhone = String(phoneNumber).replace(/\D/g, '').slice(-10);
  console.log(`Input: '${phoneNumber}' -> Normalized: '${normalizedPhone}' -> Match: ${normalizedPhone === '8080407364'}`);
});
