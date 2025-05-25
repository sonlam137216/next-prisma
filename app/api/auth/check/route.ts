import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("adminAuthToken")?.value;

    if (!authToken) {
      return NextResponse.json({ authenticated: false });
    }

    const payload = await verifyToken(authToken);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        username: payload.username,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false });
  }
} 