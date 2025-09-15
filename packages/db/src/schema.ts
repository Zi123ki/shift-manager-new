import { sqliteTable, text, integer, real, blob } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

// Companies table for multi-tenant support
export const companies = sqliteTable("companies", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  themeJson: text("theme_json"), // JSON string for theme colors/settings
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Users table for authentication and role-based access
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  username: text("username").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["ADMIN", "MANAGER", "EMPLOYEE"] }).notNull().default("EMPLOYEE"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
});

// Departments for organizing employees
export const departments = sqliteTable("departments", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").notNull().default("#3b82f6"), // Default blue color
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Employees table
export const employees = sqliteTable("employees", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  departmentId: text("department_id").references(() => departments.id, { onDelete: "set null" }),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  customFieldsJson: text("custom_fields_json"), // JSON string for dynamic fields
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Shift templates for quick shift creation
export const shiftTemplates = sqliteTable("shift_templates", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  startTime: text("start_time").notNull(), // Format: HH:MM
  endTime: text("end_time").notNull(), // Format: HH:MM
  color: text("color").notNull().default("#10b981"), // Default green color
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Shifts table
export const shifts = sqliteTable("shifts", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // Format: YYYY-MM-DD
  templateId: text("template_id").references(() => shiftTemplates.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  startTime: text("start_time").notNull(), // Format: HH:MM
  endTime: text("end_time").notNull(), // Format: HH:MM
  color: text("color").notNull().default("#10b981"),
  notes: text("notes"),
  customFieldsJson: text("custom_fields_json"), // JSON string for dynamic fields
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Shift assignments (many-to-many between shifts and employees)
export const shiftAssignments = sqliteTable("shift_assignments", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  shiftId: text("shift_id").notNull().references(() => shifts.id, { onDelete: "cascade" }),
  employeeId: text("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Absences (vacations, sick leaves, etc.)
export const absences = sqliteTable("absences", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  employeeId: text("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  startDate: text("start_date").notNull(), // Format: YYYY-MM-DD
  endDate: text("end_date").notNull(), // Format: YYYY-MM-DD
  type: text("type", { enum: ["VACATION", "SICK", "OTHER"] }).notNull().default("VACATION"),
  status: text("status", { enum: ["PENDING", "APPROVED", "REJECTED"] }).notNull().default("PENDING"),
  approverUserId: text("approver_user_id").references(() => users.id, { onDelete: "set null" }),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Audit logs for tracking changes
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  actorUserId: text("actor_user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(), // CREATE, UPDATE, DELETE, etc.
  entityType: text("entity_type").notNull(), // shift, employee, etc.
  entityId: text("entity_id").notNull(),
  beforeJson: text("before_json"), // JSON snapshot before change
  afterJson: text("after_json"), // JSON snapshot after change
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Custom fields configuration
export const customFields = sqliteTable("custom_fields", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  entity: text("entity", { enum: ["employee", "shift"] }).notNull(),
  key: text("key").notNull(), // Field identifier
  label: text("label").notNull(), // Display name
  type: text("type", { enum: ["TEXT", "NUMBER", "SELECT", "DATE", "BOOL"] }).notNull(),
  optionsJson: text("options_json"), // JSON array for SELECT type
  required: integer("required", { mode: "boolean" }).notNull().default(false),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Company settings
export const companySettings = sqliteTable("company_settings", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  localeDefault: text("locale_default", { enum: ["he", "en"] }).notNull().default("he"),
  weekStart: integer("week_start").notNull().default(0), // 0 = Sunday, 1 = Monday
  timeFormat: text("time_format", { enum: ["24h", "12h"] }).notNull().default("24h"),
  allowDragDrop: integer("allow_drag_drop", { mode: "boolean" }).notNull().default(true),
  approvalsRequired: integer("approvals_required", { mode: "boolean" }).notNull().default(true),
  brandingJson: text("branding_json"), // JSON for colors, logo, etc.
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Export types
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;
export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
export type ShiftTemplate = typeof shiftTemplates.$inferSelect;
export type NewShiftTemplate = typeof shiftTemplates.$inferInsert;
export type Shift = typeof shifts.$inferSelect;
export type NewShift = typeof shifts.$inferInsert;
export type ShiftAssignment = typeof shiftAssignments.$inferSelect;
export type NewShiftAssignment = typeof shiftAssignments.$inferInsert;
export type Absence = typeof absences.$inferSelect;
export type NewAbsence = typeof absences.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type CustomField = typeof customFields.$inferSelect;
export type NewCustomField = typeof customFields.$inferInsert;
export type CompanySettings = typeof companySettings.$inferSelect;
export type NewCompanySettings = typeof companySettings.$inferInsert;