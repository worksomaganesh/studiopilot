import crypto from "crypto";

const SESSION_COOKIE_NAME = "studiopilot_session";
const SESSION_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function getAdminEmail(): string {
  const email = process.env.ADMIN_EMAIL;
  if (!email || !email.trim()) {
    throw new Error("ADMIN_EMAIL must be explicitly configured in the environment.");
  }
  return email.trim();
}

function getSessionSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.trim().length < 32) {
    throw new Error(
      "AUTH_SESSION_SECRET must be explicitly configured in the environment and be at least 32 characters long."
    );
  }
  return secret.trim();
}

export interface SessionData {
  email: string;
  role: "admin";
  issuedAt: number;
  expiresAt: number;
}

export function signSession(email: string): string {
  const now = Math.floor(Date.now() / 1000);
  const data: SessionData = {
    email: email.toLowerCase().trim(),
    role: "admin",
    issuedAt: now,
    expiresAt: now + SESSION_EXPIRY_SECONDS,
  };

  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): SessionData | null {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const data: SessionData = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    const now = Math.floor(Date.now() / 1000);
    if (data.expiresAt < now) {
      return null;
    }

    // Verify it matches the single provisioned administrator email
    const configuredAdmin = getAdminEmail().toLowerCase().trim();
    if (data.email.toLowerCase().trim() !== configuredAdmin) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

// In-memory rate limiter for login attempts (10 attempts per 5 minutes per IP)
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

export function checkRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const maxAttempts = 10;

  const record = loginAttempts.get(ip);
  if (!record) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (now - record.firstAttempt > windowMs) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (record.count >= maxAttempts) {
    const waitSeconds = Math.ceil((record.firstAttempt + windowMs - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  record.count += 1;
  return { allowed: true };
}

export function resetRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

export { SESSION_COOKIE_NAME, SESSION_EXPIRY_SECONDS };
