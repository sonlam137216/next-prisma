// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

// This function runs before the route is processed
export async function middleware(request: NextRequest) {
  // Check if the path starts with /admin and is not the login page
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.includes("/admin/login")
  ) {
    // Check for authentication cookie
    const authToken = request.cookies.get("adminAuthToken")?.value;

    // If no token exists, redirect to login
    if (!authToken) {
      // Create the URL for the login page
      const loginUrl = new URL("/admin/login", request.url);
      // Add the original URL as a parameter for redirect after login
      loginUrl.searchParams.set("from", request.nextUrl.pathname);
      // Redirect to the login page
      return NextResponse.redirect(loginUrl);
    }

    // Verify token validity
    const payload = await verifyToken(authToken);
    if (!payload || payload.role !== "admin") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", request.nextUrl.pathname);
      // Clear the invalid token
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("adminAuthToken");
      return response;
    }
  }

  // Continue to the requested page
  return NextResponse.next();
}

// Specify which routes middleware should run on
export const config = {
  matcher: ["/admin/:path*"],
};
