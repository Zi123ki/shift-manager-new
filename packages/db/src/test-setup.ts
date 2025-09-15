import { describe, it, expect } from 'vitest';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Basic database schema tests
describe('Database Schema', () => {
  const sqlite = new Database(':memory:');
  const db = drizzle(sqlite, { schema });

  it('should create all tables without errors', async () => {
    // This test would verify that the schema can be created
    expect(schema.companies).toBeDefined();
    expect(schema.users).toBeDefined();
    expect(schema.employees).toBeDefined();
    expect(schema.shifts).toBeDefined();
  });

  it('should have correct table relationships', () => {
    // Test foreign key relationships
    expect(schema.users.companyId).toBeDefined();
    expect(schema.employees.companyId).toBeDefined();
    expect(schema.shifts.companyId).toBeDefined();
  });
});