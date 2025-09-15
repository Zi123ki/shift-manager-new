import { Hono } from "hono";
import { cors, prettyJSON } from "hono/middleware";
import type { Env } from "./types";
import { errorHandler, requestLogger } from "./middleware/auth";

// Import routes
import { auth } from "./routes/auth";
import { companiesRouter } from "./routes/companies";
import { shiftsRouter } from "./routes/shifts";

const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use("*", cors({
  origin: ["http://localhost:3000", "http://localhost:5173"], // Add your frontend URLs
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use("*", requestLogger);
app.use("*", errorHandler);
app.use("*", prettyJSON());

// Health check
app.get("/health", (c) => {
  return c.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.route("/api/auth", auth);
app.route("/api/companies", companiesRouter);
app.route("/api/shifts", shiftsRouter);

// 404 handler
app.notFound((c) => {
  return c.json({ success: false, error: "Endpoint not found" }, 404);
});

export default app;