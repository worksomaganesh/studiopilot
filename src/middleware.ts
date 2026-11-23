import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public paths that do not require authentication
const PUBLIC_PATHS = [
  "/login",
  "/api/auth/login",
  "/favicon.ico",
  "/_next",
  "/static",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets and Next.js internal files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Check if current path is a public authentication route
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));

  // Check for the session cookie
  const sessionCookie = request.cookies.get("studiopilot_session")?.value;

  // Check Supabase auth cookie if present
  const hasSupabaseSession = request.cookies.getAll().some((c) =>
    c.name.includes("sb-") && c.name.includes("-auth-token")
  );

  const isAuthenticated = Boolean(sessionCookie || hasSupabaseSession);

  // If user is accessing /login while already authenticated, redirect to /dashboard
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If on a public path, allow through
  if (isPublic) {
    return NextResponse.next();
  }

  // If not authenticated:
  if (!isAuthenticated) {
    // API routes return 401 Unauthorized
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message:
            "StudioPilot is a private workspace. You must be authenticated as administrator.",
        },
        { status: 401 }
      );
    }

    // Web pages redirect to /login with redirect parameter
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and hitting root '/', redirect to '/dashboard'
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
