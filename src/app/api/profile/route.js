
import dbConnect from '@/lib/dbConnect';
import Profile from '@/models/profile'; // create this model

export async function POST(req) {
  await dbConnect();
  const data = await req.json();

  try {
    const saved = await Profile.create(data);
    return new Response(JSON.stringify(saved), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to save profile' }), { status: 500 });
  }
}
