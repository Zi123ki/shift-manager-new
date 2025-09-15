import { drizzle } from "drizzle-orm/d1";
import * as bcrypt from "bcryptjs";
import { createId } from "@paralleldrive/cuid2";
import * as schema from "./schema";

// This script creates seed data including the default admin user
async function seed(db: any) {
  console.log("🌱 Starting seed process...");

  // Create default company
  const defaultCompany = {
    id: createId(),
    name: "Default Company",
    slug: "default-company",
    logoUrl: null,
    themeJson: JSON.stringify({
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#10b981",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1e293b"
    }),
  };

  await db.insert(schema.companies).values(defaultCompany);
  console.log("✅ Default company created");

  // Create default admin user
  const passwordHash = await bcrypt.hash("Zz321321", 10);
  const adminUser = {
    id: createId(),
    companyId: defaultCompany.id,
    username: "zvika",
    email: "admin@example.com",
    passwordHash,
    role: "ADMIN" as const,
    isActive: true,
  };

  await db.insert(schema.users).values(adminUser);
  console.log("✅ Admin user created (zvika/Zz321321)");

  // Create company settings
  const companySettings = {
    id: createId(),
    companyId: defaultCompany.id,
    localeDefault: "he" as const,
    weekStart: 0, // Sunday
    timeFormat: "24h" as const,
    allowDragDrop: true,
    approvalsRequired: true,
    brandingJson: JSON.stringify({
      primaryColor: "#3b82f6",
      secondaryColor: "#64748b",
      logoUrl: null,
      companyName: "Default Company"
    }),
  };

  await db.insert(schema.companySettings).values(companySettings);
  console.log("✅ Company settings created");

  // Create sample departments
  const departments = [
    {
      id: createId(),
      companyId: defaultCompany.id,
      name: "כוח אדם",
      color: "#3b82f6",
    },
    {
      id: createId(),
      companyId: defaultCompany.id,
      name: "שירות לקוחות",
      color: "#10b981",
    },
    {
      id: createId(),
      companyId: defaultCompany.id,
      name: "ניהול",
      color: "#f59e0b",
    },
  ];

  await db.insert(schema.departments).values(departments);
  console.log("✅ Sample departments created");

  // Create sample employees
  const employees = [
    {
      id: createId(),
      companyId: defaultCompany.id,
      fullName: "דני כהן",
      email: "danny@example.com",
      phone: "050-1234567",
      departmentId: departments[0].id,
      isActive: true,
    },
    {
      id: createId(),
      companyId: defaultCompany.id,
      fullName: "שרה לוי",
      email: "sarah@example.com",
      phone: "052-7654321",
      departmentId: departments[1].id,
      isActive: true,
    },
    {
      id: createId(),
      companyId: defaultCompany.id,
      fullName: "מיכאל אברהם",
      email: "michael@example.com",
      phone: "054-1357924",
      departmentId: departments[0].id,
      isActive: true,
    },
  ];

  await db.insert(schema.employees).values(employees);
  console.log("✅ Sample employees created");

  // Create shift templates
  const shiftTemplates = [
    {
      id: createId(),
      companyId: defaultCompany.id,
      name: "משמרת בוקר",
      startTime: "08:00",
      endTime: "16:00",
      color: "#10b981",
      notes: "משמרת בוקר רגילה",
    },
    {
      id: createId(),
      companyId: defaultCompany.id,
      name: "משמרת ערב",
      startTime: "16:00",
      endTime: "00:00",
      color: "#f59e0b",
      notes: "משמרת ערב",
    },
    {
      id: createId(),
      companyId: defaultCompany.id,
      name: "משמרת לילה",
      startTime: "00:00",
      endTime: "08:00",
      color: "#6366f1",
      notes: "משמרת לילה",
    },
  ];

  await db.insert(schema.shiftTemplates).values(shiftTemplates);
  console.log("✅ Shift templates created");

  // Create sample shifts for current week
  const today = new Date();
  const currentWeekDates = [];

  // Get Sunday of current week
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  // Generate dates for current week
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    currentWeekDates.push(date.toISOString().split('T')[0]);
  }

  const sampleShifts = [];

  // Create shifts for each day of the week
  currentWeekDates.forEach((date, dayIndex) => {
    // Skip weekends for some variety
    if (dayIndex === 5 || dayIndex === 6) return;

    // Morning shift
    sampleShifts.push({
      id: createId(),
      companyId: defaultCompany.id,
      date,
      templateId: shiftTemplates[0].id,
      name: "משמרת בוקר",
      startTime: "08:00",
      endTime: "16:00",
      color: "#10b981",
      notes: `משמרת בוקר - ${date}`,
    });

    // Evening shift
    sampleShifts.push({
      id: createId(),
      companyId: defaultCompany.id,
      date,
      templateId: shiftTemplates[1].id,
      name: "משמרת ערב",
      startTime: "16:00",
      endTime: "00:00",
      color: "#f59e0b",
      notes: `משמרת ערב - ${date}`,
    });
  });

  await db.insert(schema.shifts).values(sampleShifts);
  console.log("✅ Sample shifts created for current week");

  // Assign employees to some shifts
  const shiftAssignments = [
    {
      id: createId(),
      companyId: defaultCompany.id,
      shiftId: sampleShifts[0].id,
      employeeId: employees[0].id,
    },
    {
      id: createId(),
      companyId: defaultCompany.id,
      shiftId: sampleShifts[1].id,
      employeeId: employees[1].id,
    },
    {
      id: createId(),
      companyId: defaultCompany.id,
      shiftId: sampleShifts[2].id,
      employeeId: employees[2].id,
    },
  ];

  await db.insert(schema.shiftAssignments).values(shiftAssignments);
  console.log("✅ Sample shift assignments created");

  console.log("🎉 Seed process completed successfully!");
  console.log("👤 Admin login: zvika / Zz321321");
}

// Export for use with wrangler or direct execution
export { seed };

// For direct execution with tsx
if (import.meta.main) {
  console.log("Direct seed execution not supported in this context");
  console.log("Use 'npm run seed' from the project root");
}