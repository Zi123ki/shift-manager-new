import type { Context, Next } from "hono";
import type { Env, AuthContext, ApiResponse } from "../types";
import { drizzle } from "@shift-manager/db";
import { getSession, hasRole } from "../utils/auth";

// Middleware to require authentication
export async function requireAuth(c: Context<Env>, next: Next) {
  const session = await getSession(c);

  if (!session) {
    return c.json<ApiResponse>({
      success: false,
      error: "Authentication required",
    }, 401);
  }

  // Add session and database to context
  const db = drizzle(c.env.DB);
  c.set("session", session);
  c.set("db", db);

  await next();
}

// Middleware to require specific roles
export function requireRoles(roles: string[]) {
  return async (c: Context<Env & AuthContext>, next: Next) => {
    const session = c.get("session");

    if (!session || !hasRole(session.role, roles)) {
      return c.json<ApiResponse>({
        success: false,
        error: "Insufficient permissions",
      }, 403);
    }

    await next();
  };
}

// Middleware to require admin role
export const requireAdmin = requireRoles(["ADMIN"]);

// Middleware to require admin or manager role
export const requireManager = requireRoles(["ADMIN", "MANAGER"]);

// Middleware for CORS
export async function cors(c: Context, next: Next) {
  await next();

  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  c.header("Access-Control-Max-Age", "3600");
}

// Middleware for request logging
export async function requestLogger(c: Context, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const url = c.req.url;

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  console.log(`${method} ${url} - ${status} (${duration}ms)`);
}

// Middleware for error handling
export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof Error) {
      // Check for validation errors
      if (error.message.includes("validation")) {
        return c.json<ApiResponse>({
          success: false,
          error: "Validation failed",
          message: error.message,
        }, 400);
      }

      // Check for database errors
      if (error.message.includes("FOREIGN KEY") || error.message.includes("UNIQUE")) {
        return c.json<ApiResponse>({
          success: false,
          error: "Database constraint violation",
        }, 409);
      }
    }

    return c.json<ApiResponse>({
      success: false,
      error: "Internal server error",
    }, 500);
  }
}