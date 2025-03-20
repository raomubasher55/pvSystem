import { 
  users, type User, type InsertUser,
  Weather, Kpi, SystemComponent, GeneratorGroup,
  Alert, ForecastDay, EnergyRecord, GridRecord, powerSourceData
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

// Interface for the storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // Weather data operations
  getWeatherData(): Promise<Weather[]>;
  // KPI operations
  getKpis(): Promise<Kpi[]>;
  // Energy data operations
  getEnergyData(): Promise<EnergyRecord[]>;
  getEnergyDistribution(): Promise<any[]>;
  getEnergyHistoryDaily(): Promise<EnergyRecord[]>;
  getEnergyHistoryMonthly(): Promise<EnergyRecord[]>;
  getEnergyHistoryYearly(): Promise<EnergyRecord[]>;
  // System status operations
  getSystemComponents(): Promise<SystemComponent[]>;
  // Generator operations
  getGeneratorGroups(): Promise<GeneratorGroup[]>;
  getGeneratorTotalOutput(): Promise<string>;
  getGeneratorPerformanceHourly(): Promise<any[]>;
  getGeneratorTemperature(): Promise<any[]>;
  // Grid operations
  getGridStatus(): Promise<GridRecord>;
  getGridVoltage(): Promise<any[]>;
  getGridFrequency(): Promise<any[]>;
  // Alerts operations
  getAlerts(): Promise<Alert[]>;
  // Forecast operations
  getForecastDays(): Promise<ForecastDay[]>;
  getWeeklyForecast(): Promise<{ weeklyTotal: string, weeklyChange: number }>;
  // Weather forecast operations
  getWeatherForecast(): Promise<any[]>;
  getSolarRadiation(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getWeatherData(): Promise<Weather[]> { return []; }
  async getKpis(): Promise<Kpi[]> {
    const powerData = await db.select().from(powerSourceData)
      .where(sql`time >= NOW() - INTERVAL '24 HOUR'`)
      .orderBy(desc(powerSourceData.time));

    // Calculate KPIs from power source data
    const kpis = [];

    // Total System Power
    const totalPower = powerData.reduce((sum, source) => sum + Number(source.kwt), 0);
    kpis.push({
      id: 1,
      title: "Total System Power",
      value: `${totalPower.toFixed(2)} kW`,
      change: String(0), 
      type: "power",
      timestamp: new Date()
    });

    // Source-specific KPIs
    const sources = ['grid', 'generator', 'inverter'];
    sources.forEach((sourceType, index) => {
      const sourceData = powerData.find(d => d.source_type === sourceType);
      if (sourceData) {
        const change = Number(sourceData.kwh_export) > 0 
          ? ((Number(sourceData.kwh_export) - Number(sourceData.kwh_import)) / Number(sourceData.kwh_import)) * 100 
          : 0;

        kpis.push({
          id: index + 2,
          title: `${sourceType.charAt(0).toUpperCase() + sourceType.slice(1)} Power`,
          value: `${Number(sourceData.kwt).toFixed(2)} kW`,
          change: String(change.toFixed(1)), 
          type: sourceType,
          timestamp: sourceData.time
        });
      }
    });

    return kpis;
  }
  async getEnergyData(): Promise<EnergyRecord[]> {
    const result = await db.select().from(powerSourceData)
      .where(sql`time >= NOW() - INTERVAL '24 HOUR'`)
      .orderBy(powerSourceData.time);
    return result;
  }
  async getEnergyDistribution(): Promise<any[]> { return []; }
  async getEnergyHistoryDaily(): Promise<EnergyRecord[]> { return []; }
  async getEnergyHistoryMonthly(): Promise<EnergyRecord[]> { return []; }
  async getEnergyHistoryYearly(): Promise<EnergyRecord[]> { return []; }
  async getSystemComponents(): Promise<SystemComponent[]> { return []; }
  async getGeneratorGroups(): Promise<GeneratorGroup[]> { return []; }
  async getGeneratorTotalOutput(): Promise<string> { return "0 kW"; }
  async getGeneratorPerformanceHourly(): Promise<any[]> { return []; }
  async getGeneratorTemperature(): Promise<any[]> { return []; }
  async getGridStatus(): Promise<GridRecord> {
    const [latestGrid] = await db.select().from(powerSourceData)
      .where(eq(powerSourceData.source_type, 'grid'))
      .orderBy(desc(powerSourceData.time))
      .limit(1);

    if (!latestGrid) {
      throw new Error("No grid data available");
    }

    return {
      id: 1,
      timestamp: latestGrid.time,
      import: String(Number(latestGrid.kwh_import).toFixed(1)),
      importChange: String(0), 
      export: String(Number(latestGrid.kwh_export).toFixed(1)),
      exportChange: String(0), 
      netBalance: String((Number(latestGrid.kwh_export) - Number(latestGrid.kwh_import)).toFixed(1)),
      voltage: String(Number(latestGrid.v1).toFixed(1)),
      frequency: String(Number(latestGrid.hz).toFixed(2)),
      chartData: [], 
    };
  }
  async getGridVoltage(): Promise<any[]> { return []; }
  async getGridFrequency(): Promise<any[]> { return []; }
  async getAlerts(): Promise<Alert[]> { return []; }
  async getForecastDays(): Promise<ForecastDay[]> { return []; }
  async getWeeklyForecast(): Promise<{ weeklyTotal: string; weeklyChange: number }> {
    return { weeklyTotal: "0 kWh", weeklyChange: 0 };
  }
  async getWeatherForecast(): Promise<any[]> { return []; }
  async getSolarRadiation(): Promise<any[]> { return []; }
}

export const storage = new DatabaseStorage();