import { Hono } from "hono";
import { drizzle, eq, companies, companySettings } from "@shift-manager/db";
import type { Env, ApiResponse } from "../types";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { updateCompanySchema, updateCompanySettingsSchema } from "../utils/validation";

const companiesRouter = new Hono<{ Bindings: Env }>();

// GET /companies/current - Get current company info
companiesRouter.get("/current", requireAuth, async (c) => {
  const session = c.get("session");
  const db = c.get("db");

  try {
    const company = await db
      .select()
      .from(companies)
      .where(eq(companies.id, session.companyId))
      .get();

    if (!company) {
      return c.json<ApiResponse>({
        success: false,
        error: "Company not found",
      }, 404);
    }

    // Get company settings
    const settings = await db
      .select()
      .from(companySettings)
      .where(eq(companySettings.companyId, session.companyId))
      .get();

    return c.json<ApiResponse>({
      success: true,
      data: {
        company: {
          id: company.id,
          name: company.name,
          slug: company.slug,
          logoUrl: company.logoUrl,
          theme: company.themeJson ? JSON.parse(company.themeJson) : null,
        },
        settings: settings ? {
          localeDefault: settings.localeDefault,
          weekStart: settings.weekStart,
          timeFormat: settings.timeFormat,
          allowDragDrop: settings.allowDragDrop,
          approvalsRequired: settings.approvalsRequired,
          branding: settings.brandingJson ? JSON.parse(settings.brandingJson) : null,
        } : null,
      },
    });
  } catch (error) {
    console.error("Get company error:", error);
    return c.json<ApiResponse>({
      success: false,
      error: "Failed to get company information",
    }, 500);
  }
});

// PUT /companies/current - Update current company
companiesRouter.put("/current", requireAuth, requireAdmin, async (c) => {
  const session = c.get("session");
  const db = c.get("db");

  try {
    const body = await c.req.json();
    const updateData = updateCompanySchema.parse(body);

    await db
      .update(companies)
      .set(updateData)
      .where(eq(companies.id, session.companyId));

    return c.json<ApiResponse>({
      success: true,
      message: "Company updated successfully",
    });
  } catch (error) {
    console.error("Update company error:", error);
    return c.json<ApiResponse>({
      success: false,
      error: "Failed to update company",
    }, 500);
  }
});

// GET /companies/settings - Get company settings
companiesRouter.get("/settings", requireAuth, requireAdmin, async (c) => {
  const session = c.get("session");
  const db = c.get("db");

  try {
    const settings = await db
      .select()
      .from(companySettings)
      .where(eq(companySettings.companyId, session.companyId))
      .get();

    if (!settings) {
      return c.json<ApiResponse>({
        success: false,
        error: "Company settings not found",
      }, 404);
    }

    return c.json<ApiResponse>({
      success: true,
      data: {
        localeDefault: settings.localeDefault,
        weekStart: settings.weekStart,
        timeFormat: settings.timeFormat,
        allowDragDrop: settings.allowDragDrop,
        approvalsRequired: settings.approvalsRequired,
        branding: settings.brandingJson ? JSON.parse(settings.brandingJson) : null,
      },
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return c.json<ApiResponse>({
      success: false,
      error: "Failed to get company settings",
    }, 500);
  }
});

// PUT /companies/settings - Update company settings
companiesRouter.put("/settings", requireAuth, requireAdmin, async (c) => {
  const session = c.get("session");
  const db = c.get("db");

  try {
    const body = await c.req.json();
    const updateData = updateCompanySettingsSchema.parse(body);

    // Update the settings
    await db
      .update(companySettings)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(companySettings.companyId, session.companyId));

    return c.json<ApiResponse>({
      success: true,
      message: "Company settings updated successfully",
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return c.json<ApiResponse>({
      success: false,
      error: "Failed to update company settings",
    }, 500);
  }
});

export { companiesRouter };