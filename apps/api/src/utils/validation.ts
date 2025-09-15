import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

// User schemas
export const createUserSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "MANAGER", "EMPLOYEE"]),
  isActive: z.boolean().default(true),
});

export const updateUserSchema = z.object({
  username: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["ADMIN", "MANAGER", "EMPLOYEE"]).optional(),
  isActive: z.boolean().optional(),
});

// Company schemas
export const updateCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  logoUrl: z.string().url().nullable().optional(),
  themeJson: z.string().optional(),
});

// Department schemas
export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

// Employee schemas
export const createEmployeeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  departmentId: z.string().optional(),
  isActive: z.boolean().default(true),
  customFieldsJson: z.string().optional(),
});

export const updateEmployeeSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  departmentId: z.string().optional(),
  isActive: z.boolean().optional(),
  customFieldsJson: z.string().optional(),
});

// Shift template schemas
export const createShiftTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  notes: z.string().optional(),
});

export const updateShiftTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  notes: z.string().optional(),
});

// Shift schemas
export const createShiftSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  templateId: z.string().optional(),
  name: z.string().min(1, "Shift name is required"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  notes: z.string().optional(),
  customFieldsJson: z.string().optional(),
});

export const updateShiftSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  templateId: z.string().optional(),
  name: z.string().min(1).optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  notes: z.string().optional(),
  customFieldsJson: z.string().optional(),
});

// Shift assignment schemas
export const assignShiftSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
});

// Absence schemas
export const createAbsenceSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  type: z.enum(["VACATION", "SICK", "OTHER"]),
  notes: z.string().optional(),
});

export const updateAbsenceSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  type: z.enum(["VACATION", "SICK", "OTHER"]).optional(),
  notes: z.string().optional(),
});

export const approveAbsenceSchema = z.object({
  approved: z.boolean(),
  notes: z.string().optional(),
});

// Custom field schemas
export const createCustomFieldSchema = z.object({
  entity: z.enum(["employee", "shift"]),
  key: z.string().min(1, "Field key is required"),
  label: z.string().min(1, "Field label is required"),
  type: z.enum(["TEXT", "NUMBER", "SELECT", "DATE", "BOOL"]),
  optionsJson: z.string().optional(),
  required: z.boolean().default(false),
  orderIndex: z.number().default(0),
});

export const updateCustomFieldSchema = z.object({
  label: z.string().min(1).optional(),
  type: z.enum(["TEXT", "NUMBER", "SELECT", "DATE", "BOOL"]).optional(),
  optionsJson: z.string().optional(),
  required: z.boolean().optional(),
  orderIndex: z.number().optional(),
});

// Company settings schemas
export const updateCompanySettingsSchema = z.object({
  localeDefault: z.enum(["he", "en"]).optional(),
  weekStart: z.number().min(0).max(1).optional(),
  timeFormat: z.enum(["24h", "12h"]).optional(),
  allowDragDrop: z.boolean().optional(),
  approvalsRequired: z.boolean().optional(),
  brandingJson: z.string().optional(),
});

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
});

export const calendarQuerySchema = z.object({
  view: z.enum(["week", "month"]).optional(),
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  departmentId: z.string().optional(),
  employeeId: z.string().optional(),
});

export const exportQuerySchema = z.object({
  scope: z.enum(["shifts", "employees", "absences"]),
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  departmentId: z.string().optional(),
  format: z.enum(["csv", "pdf"]).default("csv"),
});