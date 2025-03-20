import { mysqlTable, varchar, int, datetime, decimal } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base power source schema factory
const createPowerSourceTable = (tableName: string) => mysqlTable(tableName, {
  id: int("id").primaryKey().autoincrement(),
  v1: decimal("v1", { precision: 10, scale: 2 }).notNull(),
  v2: decimal("v2", { precision: 10, scale: 2 }).notNull(),
  v3: decimal("v3", { precision: 10, scale: 2 }).notNull(),
  v12: decimal("v12", { precision: 10, scale: 2 }).notNull(),
  v23: decimal("v23", { precision: 10, scale: 2 }).notNull(),
  v31: decimal("v31", { precision: 10, scale: 2 }).notNull(),
  a1: decimal("a1", { precision: 10, scale: 2 }).notNull(),
  a2: decimal("a2", { precision: 10, scale: 2 }).notNull(),
  a3: decimal("a3", { precision: 10, scale: 2 }).notNull(),
  kva1: decimal("kva1", { precision: 10, scale: 2 }).notNull(),
  kva2: decimal("kva2", { precision: 10, scale: 2 }).notNull(),
  kva3: decimal("kva3", { precision: 10, scale: 2 }).notNull(),
  kvat: decimal("kvat", { precision: 10, scale: 2 }).notNull(),
  kvar1: decimal("kvar1", { precision: 10, scale: 2 }).notNull(),
  kvar2: decimal("kvar2", { precision: 10, scale: 2 }).notNull(),
  kvar3: decimal("kvar3", { precision: 10, scale: 2 }).notNull(),
  kvart: decimal("kvart", { precision: 10, scale: 2 }).notNull(),
  kw1: decimal("kw1", { precision: 10, scale: 2 }).notNull(),
  kw2: decimal("kw2", { precision: 10, scale: 2 }).notNull(),
  kw3: decimal("kw3", { precision: 10, scale: 2 }).notNull(),
  kwt: decimal("kwt", { precision: 10, scale: 2 }).notNull(),
  pf1: decimal("pf1", { precision: 10, scale: 2 }).notNull(),
  pf2: decimal("pf2", { precision: 10, scale: 2 }).notNull(),
  pf3: decimal("pf3", { precision: 10, scale: 2 }).notNull(),
  pft: decimal("pft", { precision: 10, scale: 2 }).notNull(),
  hz: decimal("hz", { precision: 10, scale: 2 }).notNull(),
  kwh_import: decimal("kwh_import", { precision: 10, scale: 2 }).notNull(),
  kwh_export: decimal("kwh_export", { precision: 10, scale: 2 }).notNull(),
  kvarh_import: decimal("kvarh_import", { precision: 10, scale: 2 }).notNull(),
  kvarh_export: decimal("kvarh_export", { precision: 10, scale: 2 }).notNull(),
  time: datetime("time").default(new Date()).notNull(),
});

// Create tables for each source
export const grid1 = createPowerSourceTable("grid1");
export const grid2 = createPowerSourceTable("grid2");
export const generator1 = createPowerSourceTable("generator1");
export const generator2 = createPowerSourceTable("generator2");
export const inverter1 = createPowerSourceTable("inverter1");
export const inverter2 = createPowerSourceTable("inverter2");

// Tables for grid, generator, and inverter power sources

// System alerts
export const alerts = mysqlTable("alerts", {
  id: int("id").primaryKey().autoincrement(),
  status: varchar("status", { length: 50 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  component: varchar("component", { length: 100 }).notNull(),
  time: varchar("time", { length: 50 }).notNull(),
  timestamp: datetime("timestamp").default(new Date()).notNull(),
});

// Energy forecast
export const forecastDays = mysqlTable("forecast_days", {
  id: int("id").primaryKey().autoincrement(),
  date: varchar("date", { length: 50 }).notNull(),
  weather: varchar("weather", { length: 50 }).notNull(),
  forecast: varchar("forecast", { length: 255 }).notNull(),
  comparison: decimal("comparison", { precision: 10, scale: 2 }).notNull(),
});

// Create insert schemas for each table
export const insertGrid1Schema = createInsertSchema(grid1).omit({ id: true, time: true });
export const insertGrid2Schema = createInsertSchema(grid2).omit({ id: true, time: true });
export const insertGenerator1Schema = createInsertSchema(generator1).omit({ id: true, time: true });
export const insertGenerator2Schema = createInsertSchema(generator2).omit({ id: true, time: true });
export const insertInverter1Schema = createInsertSchema(inverter1).omit({ id: true, time: true });
export const insertInverter2Schema = createInsertSchema(inverter2).omit({ id: true, time: true });

// We only need insert schemas for the power source tables

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
});

export const insertForecastDaySchema = createInsertSchema(forecastDays).omit({
  id: true,
});

// Export types for each table
export type Grid1Data = typeof grid1.$inferSelect;
export type Grid2Data = typeof grid2.$inferSelect;
export type Generator1Data = typeof generator1.$inferSelect;
export type Generator2Data = typeof generator2.$inferSelect;
export type Inverter1Data = typeof inverter1.$inferSelect;
export type Inverter2Data = typeof inverter2.$inferSelect;

// We only need types for the power source tables and the remaining alert and forecast tables

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export type InsertForecastDay = z.infer<typeof insertForecastDaySchema>;
export type ForecastDay = typeof forecastDays.$inferSelect;