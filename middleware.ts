// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function runs before the route is processed
export function middleware(request: NextRequest) {
  // Check if the path starts with /admin and is not the login page
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.includes("/admin/login")
  ) {
    // Check for authentication cookie
    const authToken = request.cookies.get("adminAuthToken")?.value;

    // If no valid token exists, redirect to login
    // if (!authToken) {
    //   // Create the URL for the login page
    //   const loginUrl = new URL("/admin/login", request.url);

    //   // Add the original URL as a parameter for redirect after login
    //   loginUrl.searchParams.set("from", request.nextUrl.pathname);

    //   // Redirect to the login page
    //   return NextResponse.redirect(loginUrl);
    // }

    // Optional: Verify token validity here
    // const isValidToken = verifyToken(authToken);
    // if (!isValidToken) {
    //   return NextResponse.redirect(new URL('/admin/login', request.url));
    // }
  }

  // Continue to the requested page
  return NextResponse.next();
}

// Specify which routes middleware should run on
export const config = {
  matcher: ["/admin/:path*"],
};
