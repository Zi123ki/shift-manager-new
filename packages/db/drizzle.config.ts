import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  driver: "d1",
  dbCredentials: {
    wranglerConfigPath: "../../wrangler.toml",
    dbName: "shift_manager_db",
  },
  verbose: true,
  strict: true,
});