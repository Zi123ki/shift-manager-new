// Environment bindings for Cloudflare Workers
export interface Env {
  DB: D1Database;
  SESSION_SECRET?: string;
  NODE_ENV?: string;
}

// Session data structure
export interface SessionData {
  userId: string;
  companyId: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
  username: string;
  email: string;
}

// Request context with session
export interface AuthContext {
  session: SessionData;
  db: any; // Drizzle DB instance
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Calendar query parameters
export interface CalendarQuery {
  view?: "week" | "month";
  start?: string; // YYYY-MM-DD
  end?: string; // YYYY-MM-DD
  departmentId?: string;
  employeeId?: string;
}

// Export query parameters
export interface ExportQuery {
  scope: "shifts" | "employees" | "absences";
  start?: string;
  end?: string;
  departmentId?: string;
  format?: "csv" | "pdf";
}