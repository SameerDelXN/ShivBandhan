export async function POST(request) {
  // Replace with real database check
  const { username, password, role } = await request.json()
  
  // Temporary hardcoded check
  if (username === 'admin' && password === 'admin123') {
    console.log("Inside auth")
    return Response.json({ success: true, role })
  }
  return Response.json({ success: false }, { status: 401 })
}