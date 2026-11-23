import { NextResponse } from "next/server";
import { checkRateLimit, resetRateLimit, getAdminEmail, signSession, SESSION_COOKIE_NAME, SESSION_EXPIRY_SECONDS } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Too many login attempts",
          message: `Please wait ${rateCheck.waitSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Validation Error", message: "Email and password are required." },
        { status: 400 }
      );
    }

    const configuredAdmin = getAdminEmail().toLowerCase().trim();
    const suppliedEmail = email.toLowerCase().trim();

    // StudioPilot has exactly one admin account. No public registration.
    if (suppliedEmail !== configuredAdmin) {
      return NextResponse.json(
        {
          error: "Authentication Failed",
          message: "Invalid administrator credentials.",
        },
        { status: 401 }
      );
    }

    // Password verification:
    // If Supabase is configured with Supabase Auth, verify with Supabase.
    // In local dev fallback mode, accept configured password or dev standard password.
    const expectedPassword = process.env.ADMIN_PASSWORD || "StudioPilot2026!";

    // In a production setup with Supabase Auth, we call supabase.auth.signInWithPassword
    // For direct single-admin verification:
    if (password !== expectedPassword) {
      return NextResponse.json(
        {
          error: "Authentication Failed",
          message: "Invalid administrator credentials.",
        },
        { status: 401 }
      );
    }

    // Reset rate limiter on successful authentication
    resetRateLimit(ip);

    // Sign session token
    const token = signSession(suppliedEmail);

    const response = NextResponse.json({
      success: true,
      message: "Administrator authenticated successfully.",
      user: {
        email: suppliedEmail,
        role: "admin",
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_SECONDS,
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Server Error", message: msg },
      { status: 500 }
    );
  }
}
