// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // In a real application, you would:
    // 1. Validate the input
    // 2. Check credentials against a database
    // 3. Use proper password hashing

    // This is a simplified example with hardcoded credentials
    if (username === "admin" && password === "admin") {
      // Create a proper JWT token using Jose
      const token = await signToken({
        username,
        role: "admin",
      });
      console.log("Token created successfully");

      // Set the token in a secure HTTP-only cookie
      const cookieStore = await cookies();
      cookieStore.set({
        name: "adminAuthToken",
        value: token,
        httpOnly: true,
        path: "/",
        secure: false,
        domain: "14.225.212.72",
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: "lax",
      });
      console.log("Cookie set successfully");

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
