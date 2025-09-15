import { Hono } from "hono";
import { drizzle, eq, users, companies } from "@shift-manager/db";
import type { Env, SessionData, ApiResponse } from "../types";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSession,
  rateLimit
} from "../utils/auth";
import { loginSchema, changePasswordSchema } from "../utils/validation";
import { requireAuth } from "../middleware/auth";

const auth = new Hono<{ Bindings: Env }>();

// POST /auth/login
auth.post("/login", async (c) => {
  const clientIP = c.req.header("CF-Connecting-IP") || c.req.header("X-Forwarded-For") || "unknown";

  // Rate limiting for login attempts
  const rateLimitResult = rateLimit(`login:${clientIP}`, 5, 15 * 60 * 1000); // 5 attempts per 15 minutes

  if (!rateLimitResult.allowed) {
    return c.json<ApiResponse>({
      success: false,
      error: "Too many login attempts. Please try again later.",
    }, 429);
  }

  try {
    const body = await c.req.json();
    const { username, password } = loginSchema.parse(body);

    const db = drizzle(c.env.DB);

    // Find user by username or email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get();

    if (!user || !user.isActive) {
      return c.json<ApiResponse>({
        success: false,
        error: "Invalid credentials",
      }, 401);
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return c.json<ApiResponse>({
        success: false,
        error: "Invalid credentials",
      }, 401);
    }

    // Get company information
    const company = await db
      .select()
      .from(companies)
      .where(eq(companies.id, user.companyId))
      .get();

    if (!company) {
      return c.json<ApiResponse>({
        success: false,
        error: "Company not found",
      }, 404);
    }

    // Update last login time
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Create session
    const sessionData: SessionData = {
      userId: user.id,
      companyId: user.companyId,
      role: user.role,
      username: user.username,
      email: user.email,
    };

    const sessionSecret = c.env.SESSION_SECRET || "dev-secret-change-in-production";
    const token = await createSessionToken(sessionData, sessionSecret);

    // Set session cookie
    setSessionCookie(c, token);

    return c.json<ApiResponse>({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        company: {
          id: company.id,
          name: company.name,
          slug: company.slug,
          theme: company.themeJson ? JSON.parse(company.themeJson) : null,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json<ApiResponse>({
      success: false,
      error: "Login failed",
    }, 400);
  }
});

// POST /auth/logout
auth.post("/logout", async (c) => {
  clearSessionCookie(c);

  return c.json<ApiResponse>({
    success: true,
    message: "Logged out successfully",
  });
});

// GET /auth/me - Get current user info
auth.get("/me", requireAuth, async (c) => {
  const session = c.get("session");
  const db = c.get("db");

  try {
    // Get fresh user data
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .get();

    if (!user || !user.isActive) {
      clearSessionCookie(c);
      return c.json<ApiResponse>({
        success: false,
        error: "User not found or inactive",
      }, 401);
    }

    // Get company data
    const company = await db
      .select()
      .from(companies)
      .where(eq(companies.id, user.companyId))
      .get();

    return c.json<ApiResponse>({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        company: {
          id: company.id,
          name: company.name,
          slug: company.slug,
          theme: company.themeJson ? JSON.parse(company.themeJson) : null,
        },
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return c.json<ApiResponse>({
      success: false,
      error: "Failed to get user information",
    }, 500);
  }
});

// POST /auth/change-password
auth.post("/change-password", requireAuth, async (c) => {
  const session = c.get("session");
  const db = c.get("db");

  try {
    const body = await c.req.json();
    const { currentPassword, newPassword } = changePasswordSchema.parse(body);

    // Get current user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .get();

    if (!user) {
      return c.json<ApiResponse>({
        success: false,
        error: "User not found",
      }, 404);
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.passwordHash);

    if (!isValidPassword) {
      return c.json<ApiResponse>({
        success: false,
        error: "Invalid current password",
      }, 400);
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await db
      .update(users)
      .set({ passwordHash: newPasswordHash })
      .where(eq(users.id, user.id));

    return c.json<ApiResponse>({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return c.json<ApiResponse>({
      success: false,
      error: "Failed to change password",
    }, 500);
  }
});

export { auth };