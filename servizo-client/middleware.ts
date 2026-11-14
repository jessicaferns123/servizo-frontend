// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Your middleware logic here
  // For example, redirect to a login page if not authenticated
  // if (!request.cookies.has('auth_token')) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next(); // Continue to the next handler
}

// Optional: Define a matcher to run middleware only on specific paths
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'], // Example: Run middleware for /dashboard and /api routes
};