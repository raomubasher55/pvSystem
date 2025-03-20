import { 
  users, type User, type InsertUser, weatherData,
  Weather, Kpi, SystemComponent, GeneratorGroup,
  Alert, ForecastDay, grid1, grid2, generator1, generator2, inverter1, inverter2, alerts, forecastDays,
  type Grid1Data, type Grid2Data, type Generator1Data, type Generator2Data,
  type Inverter1Data, type Inverter2Data
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
  getEnergyData(): Promise<any[]>;
  getEnergyDistribution(): Promise<any[]>;
  getEnergyHistoryDaily(): Promise<any[]>;
  getEnergyHistoryMonthly(): Promise<any[]>;
  getEnergyHistoryYearly(): Promise<any[]>;
  // System status operations
  getSystemComponents(): Promise<SystemComponent[]>;
  // Generator operations
  getGeneratorGroups(): Promise<GeneratorGroup[]>;
  getGeneratorTotalOutput(): Promise<string>;
  getGeneratorPerformanceHourly(): Promise<any[]>;
  getGeneratorTemperature(): Promise<any[]>;
  // Grid operations
  getGridStatus(): Promise<any>;
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

  async getWeatherData(): Promise<Weather[]> {
    const weatherRecords = await db.select().from(weatherData);
    return weatherRecords;
  }
  
  async getKpis(): Promise<Kpi[]> {
    const [latestGrid1] = await db.select().from(grid1).orderBy(desc(grid1.time)).limit(1);
    const [latestGenerator1] = await db.select().from(generator1).orderBy(desc(generator1.time)).limit(1);
    const [latestInverter1] = await db.select().from(inverter1).orderBy(desc(inverter1.time)).limit(1);

    const kpis = [];

    // Total System Power
    const totalPower = Number(latestGrid1?.kwt || 0) + Number(latestGenerator1?.kwt || 0) + Number(latestInverter1?.kwt || 0);
    kpis.push({
      id: 1,
      title: "Total System Power",
      value: `${Number(totalPower).toFixed(2)} kW`,
      change: String(0), 
      type: "power",
      timestamp: new Date()
    });

    // Source-specific KPIs
    if (latestGrid1) {
      const change = Number(latestGrid1.kwh_export) > 0 
        ? ((Number(latestGrid1.kwh_export) - Number(latestGrid1.kwh_import)) / Number(latestGrid1.kwh_import)) * 100 
        : 0;
      kpis.push({
        id: 2,
        title: "Grid Power",
        value: `${Number(latestGrid1.kwt).toFixed(2)} kW`,
        change: String(change.toFixed(1)), 
        type: "grid",
        timestamp: latestGrid1.time
      });
    }

    if (latestGenerator1) {
      const change = Number(latestGenerator1.kwh_export) > 0 
        ? ((Number(latestGenerator1.kwh_export) - Number(latestGenerator1.kwh_import)) / Number(latestGenerator1.kwh_import)) * 100 
        : 0;
      kpis.push({
        id: 3,
        title: "Generator Power",
        value: `${Number(latestGenerator1.kwt).toFixed(2)} kW`,
        change: String(change.toFixed(1)), 
        type: "generator",
        timestamp: latestGenerator1.time
      });
    }

    if (latestInverter1) {
      const change = Number(latestInverter1.kwh_export) > 0 
        ? ((Number(latestInverter1.kwh_export) - Number(latestInverter1.kwh_import)) / Number(latestInverter1.kwh_import)) * 100 
        : 0;
      kpis.push({
        id: 4,
        title: "Inverter Power",
        value: `${Number(latestInverter1.kwt).toFixed(2)} kW`,
        change: String(change.toFixed(1)), 
        type: "inverter",
        timestamp: latestInverter1.time
      });
    }

    return kpis;
  }
  async getEnergyData(): Promise<any[]> {
    const result = await db.select().from(grid1)
      .where(sql`time >= NOW() - INTERVAL '24 HOUR'`)
      .orderBy(grid1.time);
    return result;
  }
  async getEnergyDistribution(): Promise<any[]> {
    // Get the latest data from each power source
    const [latestGrid1] = await db.select().from(grid1).orderBy(desc(grid1.time)).limit(1);
    const [latestGrid2] = await db.select().from(grid2).orderBy(desc(grid2.time)).limit(1);
    const [latestGenerator1] = await db.select().from(generator1).orderBy(desc(generator1.time)).limit(1);
    const [latestGenerator2] = await db.select().from(generator2).orderBy(desc(generator2.time)).limit(1);
    const [latestInverter1] = await db.select().from(inverter1).orderBy(desc(inverter1.time)).limit(1);
    const [latestInverter2] = await db.select().from(inverter2).orderBy(desc(inverter2.time)).limit(1);

    // Calculate total power from each source
    const gridTotal = (latestGrid1?.kwt || 0) + (latestGrid2?.kwt || 0);
    const generatorTotal = (latestGenerator1?.kwt || 0) + (latestGenerator2?.kwt || 0);
    const inverterTotal = (latestInverter1?.kwt || 0) + (latestInverter2?.kwt || 0);

    // Return distribution data
    return [
      { name: "Grid", value: gridTotal },
      { name: "Generator", value: generatorTotal },
      { name: "Inverter", value: inverterTotal }
    ];
  }

  async getEnergyHistoryDaily(): Promise<any[]> {
    // Generate sample daily energy history (last 7 days)
    const result = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Query data for this day
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Get data from each source for this day
      const gridData = await db.select().from(grid1)
        .where(sql`time >= ${dayStart} AND time <= ${dayEnd}`)
        .orderBy(grid1.time);
        
      const generatorData = await db.select().from(generator1)
        .where(sql`time >= ${dayStart} AND time <= ${dayEnd}`)
        .orderBy(generator1.time);
        
      const inverterData = await db.select().from(inverter1)
        .where(sql`time >= ${dayStart} AND time <= ${dayEnd}`)
        .orderBy(inverter1.time);
      
      // Calculate totals
      const production = Math.max(0, generatorData.reduce((sum, record) => sum + Number(record.kwt || 0), 0) + 
                         inverterData.reduce((sum, record) => sum + Number(record.kwt || 0), 0));
                         
      const consumption = gridData.reduce((sum, record) => sum + Number(record.kwh_import || 0), 0) + 
                         production;
                         
      const gridExport = gridData.reduce((sum, record) => sum + Number(record.kwh_export || 0), 0);
      
      result.push({
        date: dateString,
        production: production || Math.random() * 100 + 50, // Fallback value if no data
        consumption: consumption || Math.random() * 150 + 70, // Fallback value if no data
        gridExport: gridExport || Math.random() * 30 // Fallback value if no data
      });
    }
    
    return result;
  }

  async getEnergyHistoryMonthly(): Promise<any[]> {
    // Generate monthly energy history (last 6 months)
    const result = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - i);
      const monthString = date.toLocaleDateString('en-US', { month: 'short' });
      
      result.push({
        month: monthString,
        production: Math.random() * 2000 + 1000,
        consumption: Math.random() * 3000 + 1500,
        gridExport: Math.random() * 800 + 200
      });
    }
    
    return result;
  }

  async getEnergyHistoryYearly(): Promise<any[]> {
    // Generate yearly energy history (last 5 years)
    const result = [];
    const currentYear = new Date().getFullYear();
    
    for (let i = 4; i >= 0; i--) {
      const year = currentYear - i;
      
      result.push({
        year: year.toString(),
        production: Math.random() * 24000 + 12000,
        consumption: Math.random() * 32000 + 16000,
        gridExport: Math.random() * 8000 + 4000
      });
    }
    
    return result;
  }

  async getSystemComponents(): Promise<SystemComponent[]> {
    return db.select().from(systemComponents);
  }

  async getGeneratorGroups(): Promise<GeneratorGroup[]> {
    return db.select().from(generatorGroups);
  }
  async getGeneratorTotalOutput(): Promise<string> { return "0 kW"; }
  async getGeneratorPerformanceHourly(): Promise<any[]> { return []; }
  async getGeneratorTemperature(): Promise<any[]> { return []; }
  async getGridStatus(): Promise<any> {
    const [latestGrid] = await db.select().from(grid1)
      .orderBy(desc(grid1.time))
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