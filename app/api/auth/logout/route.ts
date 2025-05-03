// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Clear the authentication cookie
  const cookie = await cookies();
  cookie.delete("adminAuthToken");

  return NextResponse.json({ success: true });
}
