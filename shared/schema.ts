import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base power source schema factory
const createPowerSourceTable = (tableName: string) => pgTable(tableName, {
  id: serial("id").primaryKey(),
  v1: decimal("v1").notNull(),
  v2: decimal("v2").notNull(),
  v3: decimal("v3").notNull(),
  v12: decimal("v12").notNull(),
  v23: decimal("v23").notNull(),
  v31: decimal("v31").notNull(),
  a1: decimal("a1").notNull(),
  a2: decimal("a2").notNull(),
  a3: decimal("a3").notNull(),
  kva1: decimal("kva1").notNull(),
  kva2: decimal("kva2").notNull(),
  kva3: decimal("kva3").notNull(),
  kvat: decimal("kvat").notNull(),
  kvar1: decimal("kvar1").notNull(),
  kvar2: decimal("kvar2").notNull(),
  kvar3: decimal("kvar3").notNull(),
  kvart: decimal("kvart").notNull(),
  kw1: decimal("kw1").notNull(),
  kw2: decimal("kw2").notNull(),
  kw3: decimal("kw3").notNull(),
  kwt: decimal("kwt").notNull(),
  pf1: decimal("pf1").notNull(),
  pf2: decimal("pf2").notNull(),
  pf3: decimal("pf3").notNull(),
  pft: decimal("pft").notNull(),
  hz: decimal("hz").notNull(),
  kwh_import: decimal("kwh_import").notNull(),
  kwh_export: decimal("kwh_export").notNull(),
  kvarh_import: decimal("kvarh_import").notNull(),
  kvarh_export: decimal("kvarh_export").notNull(),
  time: timestamp("time").defaultNow().notNull(),
});

// Create tables for each source
export const grid1 = createPowerSourceTable("grid1");
export const grid2 = createPowerSourceTable("grid2");
export const generator1 = createPowerSourceTable("generator1");
export const generator2 = createPowerSourceTable("generator2");
export const inverter1 = createPowerSourceTable("inverter1");
export const inverter2 = createPowerSourceTable("inverter2");

// These tables have been removed. Now we only use the power source tables (grid1, grid2, generator1, generator2, inverter1, inverter2)

// System alerts
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  status: text("status").notNull(),
  description: text("description").notNull(),
  component: text("component").notNull(),
  time: text("time").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Energy forecast
export const forecastDays = pgTable("forecast_days", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  weather: text("weather").notNull(),
  forecast: text("forecast").notNull(),
  comparison: decimal("comparison").notNull(),
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