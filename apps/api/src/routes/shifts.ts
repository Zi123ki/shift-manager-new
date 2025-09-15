import { Hono } from "hono";
import { drizzle, eq, and, or, gte, lte, desc, shifts, shiftAssignments, employees, departments, shiftTemplates, absences } from "@shift-manager/db";
import { createId } from "@paralleldrive/cuid2";
import type { Env, ApiResponse, CalendarQuery } from "../types";
import { requireAuth, requireManager } from "../middleware/auth";
import {
  createShiftSchema,
  updateShiftSchema,
  assignShiftSchema,
  calendarQuerySchema
} from "../utils/validation";

const shiftsRouter = new Hono<{ Bindings: Env }>();

// GET /shifts/calendar - Get calendar view data
shiftsRouter.get("/calendar", requireAuth, async (c) => {
  const session = c.get("session");
  const db = c.get("db");

  try {
    const query = c.req.query();
    const { view, start, end, departmentId, employeeId } = calendarQuerySchema.parse(query);

    // Build base query
    let shiftQuery = db
      .select({
        shift: shifts,
        assignments: shiftAssignments,
        employee: employees,
        department: departments,
      })
      .from(shifts)
      .leftJoin(shiftAssignments, eq(shifts.id, shiftAssignments.shiftId))
      .leftJoin(employees, eq(shiftAssignments.employeeId, employees.id))
      .leftJoin(departments, eq(employees.departmentId, departments.id))
      .where(eq(shifts.companyId, session.companyId));

    // Apply filters
    if (start && end) {
      shiftQuery = shiftQuery.where(
        and(
          eq(shifts.companyId, session.companyId),
          gte(shifts.date, start),
          lte(shifts.date, end)
        )
      );
    }

    if (departmentId) {
      shiftQuery = shiftQuery.where(eq(departments.id, departmentId));
    }

    if (employeeId) {
      shiftQuery = shiftQuery.where(eq(employees.id, employeeId));
    }

    const results = await shiftQuery;

    // Group shifts by date and organize data
    const calendarData: Record<string, any[]> = {};

    for (const result of results) {
      const date = result.shift.date;

      if (!calendarData[date]) {
        calendarData[date] = [];
      }

      const existingShift = calendarData[date].find(s => s.id === result.shift.id);

      if (existingShift) {
        // Add employee to existing shift
        if (result.employee) {
          existingShift.employees.push({
            id: result.employee.id,
            fullName: result.employee.fullName,
            department: result.department ? {
              id: result.department.id,
              name: result.department.name,
              color: result.department.color,
            } : null,
          });
        }
      } else {
        // Create new shift entry
        calendarData[date].push({
          id: result.shift.id,
          name: result.shift.name,
          startTime: result.shift.startTime,
          endTime: result.shift.endTime,
          color: result.shift.color,
          notes: result.shift.notes,
          customFields: result.shift.customFieldsJson ? JSON.parse(result.shift.customFieldsJson) : null,
          employees: result.employee ? [{
            id: result.employee.id,
            fullName: result.employee.fullName,
            department: result.department ? {
              id: result.department.id,
              name: result.department.name,
              color: result.department.color,
            } : null,
          }] : [],
        });
      }
    }

    // Also get absence information for the date range
    let absenceData = [];
    if (start && end) {
      const absenceResults = await db
        .select({
          absence: absences,
          employee: employees,
        })
        .from(absences)
        .leftJoin(employees, eq(absences.employeeId, employees.id))
        .where(
          and(
            eq(absences.companyId, session.companyId),
            eq(absences.status, "APPROVED"),
            or(
              and(gte(absences.startDate, start), lte(absences.startDate, end)),
              and(gte(absences.endDate, start), lte(absences.endDate, end)),
              and(lte(absences.startDate, start), gte(absences.endDate, end))
            )
          )
        );

      absenceData = absenceResults.map(result => ({
        id: result.absence.id,
        employeeId: result.absence.employeeId,
        employeeName: result.employee?.fullName,
        startDate: result.absence.startDate,
        endDate: result.absence.endDate,
        type: result.absence.type,
      }));
    }

    return c.json<ApiResponse>({
      success: true,
      data: {
        shifts: calendarData,
        absences: absenceData,
      },
    });
  } catch (error) {
    console.error("Get calendar error:", error);
    return c.json<ApiResponse>({
      success: false,
      error: "Failed to get calendar data",
    }, 500);
  }
});

// GET /shifts - Get all shifts
shiftsRouter.get("/", requireAuth, async (c) => {
  const session = c.get("session");
  const db = c.get("db");

  try {
    const results = await db
      .select({
        shift: shifts,
        template: shiftTemplates,
      })
      .from(shifts)
      .leftJoin(shiftTemplates, eq(shifts.templateId, shiftTemplates.id))
      .where(eq(shifts.companyId, session.companyId))
      .orderBy(desc(shifts.date));

    return c.json<ApiResponse>({
      success: true,
      data: results.map(result => ({
        ...result.shift,
        template: result.template,
        customFields: result.shift.customFieldsJson ? JSON.parse(result.shift.customFieldsJson) : null,
      })),
    });
  } catch (error) {
    console.error("Get shifts error:", error);
    return c.json<ApiResponse>({
      success: false,
      error: "Failed to get shifts",
    }, 500);
  }
});

// POST /shifts - Create new shift
shiftsRouter.post("/", requireAuth, requireManager, async (c) => {
  const session = c.get("session");
  const db = c.get("db");

  try {
    const body = await c.req.json();
    const shiftData = createShiftSchema.parse(body);

    const newShift = {
      id: createId(),
      companyId: session.companyId,
      ...shiftData,
    };

    await db.insert(shifts).values(newShift);

    return c.json<ApiResponse>({
      success: true,
      data: newShift,
      message: "Shift created successfully",
    });
  } catch (error) {
    console.error("Create shift error:", error);
    return c.json<ApiResponse>({
      success: false,
      error: "Failed to create shift",
    }, 500);
  }
});

// PUT /shifts/:id - Update shift
shiftsRouter.put("/:id", requireAuth, requireManager, async (c) => {
  const session = c.get("session");
  const db = c.get("db");
  const shiftId = c.req.param("id");

  try {
    const body = await c.req.json();
    const updateData = updateShiftSchema.parse(body);

    // Verify shift belongs to company
    const existingShift = await db
      .select()
      .from(shifts)
      .where(and(eq(shifts.id, shiftId), eq(shifts.companyId, session.companyId)))
      .get();

    if (!existingShift) {
      return c.json<ApiResponse>({
        success: false,
        error: "Shift not found",
      }, 404);
    }

    await db
      .update(shifts)
      .set(updateData)
      .where(eq(shifts.id, shiftId));

    return c.json<ApiResponse>({
      success: true,
      message: "Shift updated successfully",
    });
  } catch (error) {
    console.error("Update shift error:", error);
    return c.json<ApiResponse>({
      success: false,
      error: "Failed to update shift",
    }, 500);
  }
});

// DELETE /shifts/:id - Delete shift
shiftsRouter.delete("/:id", requireAuth, requireManager, async (c) => {
  const session = c.get("session");
  const db = c.get("db");
  const shiftId = c.req.param("id");

  try {
    // Verify shift belongs to company
    const existingShift = await db
      .select()
      .from(shifts)
      .where(and(eq(shifts.id, shiftId), eq(shifts.companyId, session.companyId)))
      .get();

    if (!existingShift) {
      return c.json<ApiResponse>({
        success: false,
        error: "Shift not found",
      }, 404);
    }

    // Delete shift assignments first
    await db
      .delete(shiftAssignments)
      .where(eq(shiftAssignments.shiftId, shiftId));

    // Delete shift
    await db
      .delete(shifts)
      .where(eq(shifts.id, shiftId));

    return c.json<ApiResponse>({
      success: true,
      message: "Shift deleted successfully",
    });
  } catch (error) {
    console.error("Delete shift error:", error);
    return c.json<ApiResponse>({
      success: false,
      error: "Failed to delete shift",
    }, 500);
  }
});

// POST /shifts/:id/assign - Assign employee to shift
shiftsRouter.post("/:id/assign", requireAuth, requireManager, async (c) => {
  const session = c.get("session");
  const db = c.get("db");
  const shiftId = c.req.param("id");

  try {
    const body = await c.req.json();
    const { employeeId } = assignShiftSchema.parse(body);

    // Verify shift belongs to company
    const shift = await db
      .select()
      .from(shifts)
      .where(and(eq(shifts.id, shiftId), eq(shifts.companyId, session.companyId)))
      .get();

    if (!shift) {
      return c.json<ApiResponse>({
        success: false,
        error: "Shift not found",
      }, 404);
    }

    // Verify employee belongs to company
    const employee = await db
      .select()
      .from(employees)
      .where(and(eq(employees.id, employeeId), eq(employees.companyId, session.companyId)))
      .get();

    if (!employee) {
      return c.json<ApiResponse>({
        success: false,
        error: "Employee not found",
      }, 404);
    }

    // Check if employee is on absence during this shift
    const shiftDate = shift.date;
    const conflictingAbsence = await db
      .select()
      .from(absences)
      .where(
        and(
          eq(absences.employeeId, employeeId),
          eq(absences.status, "APPROVED"),
          lte(absences.startDate, shiftDate),
          gte(absences.endDate, shiftDate)
        )
      )
      .get();

    if (conflictingAbsence) {
      return c.json<ApiResponse>({
        success: false,
        error: "Employee is on absence during this shift",
        message: `Employee has ${conflictingAbsence.type.toLowerCase()} from ${conflictingAbsence.startDate} to ${conflictingAbsence.endDate}`,
      }, 409);
    }

    // Check if assignment already exists
    const existingAssignment = await db
      .select()
      .from(shiftAssignments)
      .where(and(eq(shiftAssignments.shiftId, shiftId), eq(shiftAssignments.employeeId, employeeId)))
      .get();

    if (existingAssignment) {
      return c.json<ApiResponse>({
        success: false,
        error: "Employee is already assigned to this shift",
      }, 409);
    }

    // Create assignment
    const assignment = {
      id: createId(),
      companyId: session.companyId,
      shiftId,
      employeeId,
    };

    await db.insert(shiftAssignments).values(assignment);

    return c.json<ApiResponse>({
      success: true,
      data: assignment,
      message: "Employee assigned to shift successfully",
    });
  } catch (error) {
    console.error("Assign shift error:", error);
    return c.json<ApiResponse>({
      success: false,
      error: "Failed to assign employee to shift",
    }, 500);
  }
});

// DELETE /shift-assignments/:id - Remove shift assignment
shiftsRouter.delete("/assignments/:id", requireAuth, requireManager, async (c) => {
  const session = c.get("session");
  const db = c.get("db");
  const assignmentId = c.req.param("id");

  try {
    // Verify assignment belongs to company
    const assignment = await db
      .select()
      .from(shiftAssignments)
      .where(and(eq(shiftAssignments.id, assignmentId), eq(shiftAssignments.companyId, session.companyId)))
      .get();

    if (!assignment) {
      return c.json<ApiResponse>({
        success: false,
        error: "Assignment not found",
      }, 404);
    }

    await db
      .delete(shiftAssignments)
      .where(eq(shiftAssignments.id, assignmentId));

    return c.json<ApiResponse>({
      success: true,
      message: "Shift assignment removed successfully",
    });
  } catch (error) {
    console.error("Remove assignment error:", error);
    return c.json<ApiResponse>({
      success: false,
      error: "Failed to remove shift assignment",
    }, 500);
  }
});

export { shiftsRouter };