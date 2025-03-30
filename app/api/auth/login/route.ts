// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // In a real application, you would:
    // 1. Validate the input
    // 2. Check credentials against a database
    // 3. Use proper password hashing
    // 4. Create a secure JWT token

    // This is a simplified example with hardcoded credentials
    if (username === "admin" && password === "admin") {
      // Create a simple token (in a real app, use a proper JWT library)
      const token = btoa(
        JSON.stringify({
          username,
          role: "admin",
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        })
      );

      // Set the token in a secure HTTP-only cookie
      (
        await // Set the token in a secure HTTP-only cookie
        cookies()
      ).set({
        name: "adminAuthToken",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: "strict",
      });

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
