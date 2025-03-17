import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (keeping from original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Weather data table
export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  temperature: decimal("temperature").notNull(),
  condition: text("condition").notNull(),
  humidity: decimal("humidity").notNull(),
  wind: decimal("wind").notNull(),
  uvIndex: decimal("uv_index").notNull(),
  visibility: decimal("visibility").notNull(),
  solarIntensity: text("solar_intensity").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// KPI data table
export const kpis = pgTable("kpis", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  value: text("value").notNull(),
  change: decimal("change").notNull(),
  type: text("type").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Energy production data
export const energyData = pgTable("energy_data", {
  id: serial("id").primaryKey(),
  time: timestamp("time").defaultNow().notNull(),
  production: decimal("production").notNull(),
  consumption: decimal("consumption").notNull(),
  grid: decimal("grid").notNull(),
});

// System components
export const systemComponents = pgTable("system_components", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  details: text("details").notNull(),
  status: text("status").notNull(),
  output: text("output").notNull(),
  type: text("type").notNull(),
});

// Generator groups
export const generatorGroups = pgTable("generator_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  output: text("output").notNull(),
  efficiency: decimal("efficiency").notNull(),
});

// Grid data
export const gridData = pgTable("grid_data", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  import: decimal("import").notNull(),
  importChange: decimal("import_change").notNull(),
  export: decimal("export").notNull(),
  exportChange: decimal("export_change").notNull(),
  netBalance: text("net_balance").notNull(),
  voltage: text("voltage").notNull(),
  frequency: text("frequency").notNull(),
  chartData: jsonb("chart_data").notNull(),
});

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

// Schemas for data insertion
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWeatherSchema = createInsertSchema(weatherData).omit({
  id: true,
  timestamp: true,
});

export const insertKpiSchema = createInsertSchema(kpis).omit({
  id: true,
  timestamp: true,
});

export const insertEnergyDataSchema = createInsertSchema(energyData).omit({
  id: true,
});

export const insertSystemComponentSchema = createInsertSchema(systemComponents).omit({
  id: true,
});

export const insertGeneratorGroupSchema = createInsertSchema(generatorGroups).omit({
  id: true,
});

export const insertGridDataSchema = createInsertSchema(gridData).omit({
  id: true,
  timestamp: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
});

export const insertForecastDaySchema = createInsertSchema(forecastDays).omit({
  id: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWeather = z.infer<typeof insertWeatherSchema>;
export type Weather = typeof weatherData.$inferSelect;

export type InsertKpi = z.infer<typeof insertKpiSchema>;
export type Kpi = typeof kpis.$inferSelect;

export type InsertEnergyData = z.infer<typeof insertEnergyDataSchema>;
export type EnergyRecord = typeof energyData.$inferSelect;

export type InsertSystemComponent = z.infer<typeof insertSystemComponentSchema>;
export type SystemComponent = typeof systemComponents.$inferSelect;

export type InsertGeneratorGroup = z.infer<typeof insertGeneratorGroupSchema>;
export type GeneratorGroup = typeof generatorGroups.$inferSelect;

export type InsertGridData = z.infer<typeof insertGridDataSchema>;
export type GridRecord = typeof gridData.$inferSelect;

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export type InsertForecastDay = z.infer<typeof insertForecastDaySchema>;
export type ForecastDay = typeof forecastDays.$inferSelect;
