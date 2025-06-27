export async function POST(request) {
  // Replace with real database check
  const { email, password, role } = await request.json()
  
  // Temporary hardcoded check
  if (email === 'admin@example.com' && password === 'admin123') {
    return Response.json({ success: true, role })
  }
  return Response.json({ success: false }, { status: 401 })
}