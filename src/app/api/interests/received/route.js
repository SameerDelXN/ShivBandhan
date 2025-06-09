
import dbConnect from '@/lib/dbConnect';
import Interest from '@/models/interest';
import { getUserIdFromRequest } from '@/lib/auth'; // your auth helper

export async function GET(req) {
  try {
    await dbConnect();

    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Fetch all interests received by this user
    const receivedInterests = await Interest.find({ receiverId: userId }).sort({ sentAt: -1 });

    return new Response(JSON.stringify(receivedInterests), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching received interests:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
