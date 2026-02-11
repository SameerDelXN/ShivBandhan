
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'shivbandhan1234139';
const BASE_URL = 'http://localhost:3000';

// Generate a fake user ID (24 hex chars)
const fakeUserId = '507f1f77bcf86cd799439011';
const token = jwt.sign({ userId: fakeUserId }, JWT_SECRET, { expiresIn: '1h' });

console.log('Testing with User ID:', fakeUserId);
console.log('Generated Token:', token);

async function testApi() {
  try {
    // 1. Create a Notification
    console.log('\n--- 1. Testing POST /api/notifications ---');
    const createRes = await fetch(`${BASE_URL}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: fakeUserId,
        title: 'Test Notification',
        message: 'This is a test notification from the verification script',
        type: 'info'
      })
    });

    const createData = await createRes.json();
    console.log('Status:', createRes.status);
    console.log('Response:', JSON.stringify(createData, null, 2));

    if (createRes.status !== 201) {
      console.error('FAILED to create notification. check backend logs.');
      return;
    }

    // 2. Fetch Notifications
    console.log('\n--- 2. Testing GET /api/notifications ---');
    const fetchRes = await fetch(`${BASE_URL}/api/notifications`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    const fetchData = await fetchRes.json();
    console.log('Status:', fetchRes.status);
    console.log('Response:', JSON.stringify(fetchData, null, 2));

    if (fetchData.success && fetchData.notifications.length > 0) {
        // Verify the one we just created is there
        const recent = fetchData.notifications[0];
        if (recent.message === 'This is a test notification from the verification script') {
            console.log('\nSUCCESS: Notification flow verified!');
        } else {
             console.log('\nWARNING: Created notification not found at top of list.');
        }
    } else {
        console.error('\nFAILED: Could not fetch notifications.');
    }

  } catch (error) {
    console.error('Error running test:', error);
    if (error.cause) console.error('Cause:', error.cause);
    console.log('\nensure the backend server is running on http://localhost:3000');
  }
}

testApi();
