import * as bcrypt from "bcryptjs";
import { sign, verify } from "hono/jwt";
import type { Context } from "hono";
import type { Env, SessionData } from "../types";

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Verify password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create JWT session token
export async function createSessionToken(data: SessionData, secret: string): Promise<string> {
  return sign(data, secret, "HS256");
}

// Verify JWT session token
export async function verifySessionToken(token: string, secret: string): Promise<SessionData | null> {
  try {
    const payload = await verify(token, secret, "HS256");
    return payload as SessionData;
  } catch (error) {
    return null;
  }
}

// Set session cookie
export function setSessionCookie(c: Context, token: string) {
  c.header(
    "Set-Cookie",
    `session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800` // 7 days
  );
}

// Clear session cookie
export function clearSessionCookie(c: Context) {
  c.header(
    "Set-Cookie",
    `session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
  );
}

// Get session from request
export async function getSession(c: Context<Env>): Promise<SessionData | null> {
  const sessionSecret = c.env.SESSION_SECRET || "dev-secret-change-in-production";

  // Try to get session from cookie
  const sessionCookie = c.req.header("Cookie")?.match(/session=([^;]+)/)?.[1];

  if (!sessionCookie) {
    return null;
  }

  try {
    const session = await verifySessionToken(sessionCookie, sessionSecret);
    return session;
  } catch (error) {
    return null;
  }
}

// Check if user has required role
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  const roleHierarchy = {
    ADMIN: 3,
    MANAGER: 2,
    EMPLOYEE: 1,
  };

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = Math.min(
    ...requiredRoles.map(role => roleHierarchy[role as keyof typeof roleHierarchy] || 0)
  );

  return userLevel >= requiredLevel;
}

// Rate limiting helper (simple in-memory implementation)
const rateLimitStore = new Map<string, { count: number; reset: number }>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.reset) {
    // Reset or create new entry
    rateLimitStore.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (entry.count >= limit) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, reset: entry.reset };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);

  return { allowed: true, remaining: limit - entry.count, reset: entry.reset };
}