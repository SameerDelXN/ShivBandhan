// app/api/admin/login/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/admin";
import { createToken, setTokenCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 401 }
      );
    }

    if (password !== admin.password) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    // Include role in token or response
    const token = createToken(admin._id, true);
    const response = NextResponse.json({
      success: true,
      adminId: admin._id,
      username: admin.username,
      role: admin.role // Include role here
    });

    setTokenCookie(response, token);
    return response;

  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "Server error during login" },
      { status: 500 }
    );
  }
}
