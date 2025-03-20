import { 
  users, type User, type InsertUser, weatherData, systemComponents, generatorGroups,
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
    const gridTotal = Number(latestGrid1?.kwt || 0) + Number(latestGrid2?.kwt || 0);
    const generatorTotal = Number(latestGenerator1?.kwt || 0) + Number(latestGenerator2?.kwt || 0);
    const inverterTotal = Number(latestInverter1?.kwt || 0) + Number(latestInverter2?.kwt || 0);

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
  async getGeneratorTotalOutput(): Promise<string> {
    // Calculate total power output from generator sources
    const [latestGenerator1] = await db.select().from(generator1).orderBy(desc(generator1.time)).limit(1);
    const [latestGenerator2] = await db.select().from(generator2).orderBy(desc(generator2.time)).limit(1);
    
    const totalOutput = Number(latestGenerator1?.kwt || 0) + Number(latestGenerator2?.kwt || 0);
    return `${totalOutput.toFixed(1)} kW`;
  }
  
  async getGeneratorPerformanceHourly(): Promise<any[]> {
    // Get generator data for the past 24 hours
    const past24Hours = new Date();
    past24Hours.setHours(past24Hours.getHours() - 24);
    
    const gen1Data = await db.select().from(generator1)
      .where(sql`time >= ${past24Hours}`)
      .orderBy(generator1.time);
      
    // Process the data to hourly intervals
    const hourlyData = [];
    const hours = 24;
    
    for (let i = 0; i < hours; i++) {
      const hourTime = new Date();
      hourTime.setHours(hourTime.getHours() - hours + i);
      
      // Find records for this hour
      const hourStart = new Date(hourTime);
      hourStart.setMinutes(0, 0, 0);
      const hourEnd = new Date(hourTime);
      hourEnd.setMinutes(59, 59, 999);
      
      // Filter generator data for this hour
      const hourlyRecords = gen1Data.filter(
        record => record.time >= hourStart && record.time <= hourEnd
      );
      
      // Calculate average power for this hour
      const avgPower = hourlyRecords.length > 0
        ? hourlyRecords.reduce((sum, record) => sum + Number(record.kwt || 0), 0) / hourlyRecords.length
        : 0;
      
      // Format the time label (e.g., "14:00")
      const timeLabel = hourTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      
      hourlyData.push({
        time: timeLabel,
        output: avgPower
      });
    }
    
    return hourlyData;
  }
  
  async getGeneratorTemperature(): Promise<any[]> {
    // Generate simulated temperature data based on generator power output
    const [latestGenerator] = await db.select().from(generator1).orderBy(desc(generator1.time)).limit(1);
    
    if (!latestGenerator) {
      return [];
    }
    
    // Calculate temperature based on power output (simulation)
    const baseTempEngine = 80; // base engine temperature (°C)
    const baseTempOil = 60;    // base oil temperature (°C)
    const baseTempExhaust = 120; // base exhaust temperature (°C)
    
    // Power output affects temperature (simulation)
    const loadFactor = Number(latestGenerator.kwt) / 100; // assuming 100kW is maximum capacity
    const engineTemp = baseTempEngine + (loadFactor * 30);
    const oilTemp = baseTempOil + (loadFactor * 20);
    const exhaustTemp = baseTempExhaust + (loadFactor * 200);
    
    return [
      { name: "Engine", value: engineTemp },
      { name: "Oil", value: oilTemp },
      { name: "Exhaust", value: exhaustTemp }
    ];
  }
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
  async getGridVoltage(): Promise<any[]> {
    // Get voltage data for the past 24 hours
    const past24Hours = new Date();
    past24Hours.setHours(past24Hours.getHours() - 24);
    
    const voltageData = await db.select({
      v1: grid1.v1,
      v2: grid1.v2,
      v3: grid1.v3,
      time: grid1.time
    })
    .from(grid1)
    .where(sql`time >= ${past24Hours}`)
    .orderBy(grid1.time);
    
    // Transform data for chart display (hourly intervals)
    const hourlyData = [];
    const hours = 24;
    
    for (let i = 0; i < hours; i++) {
      const hourTime = new Date();
      hourTime.setHours(hourTime.getHours() - hours + i);
      
      // Find records for this hour
      const hourStart = new Date(hourTime);
      hourStart.setMinutes(0, 0, 0);
      const hourEnd = new Date(hourTime);
      hourEnd.setMinutes(59, 59, 999);
      
      // Filter voltage data for this hour
      const hourlyRecords = voltageData.filter(
        record => record.time >= hourStart && record.time <= hourEnd
      );
      
      if (hourlyRecords.length > 0) {
        // Calculate averages
        const v1Avg = hourlyRecords.reduce((sum, record) => sum + Number(record.v1 || 0), 0) / hourlyRecords.length;
        const v2Avg = hourlyRecords.reduce((sum, record) => sum + Number(record.v2 || 0), 0) / hourlyRecords.length;
        const v3Avg = hourlyRecords.reduce((sum, record) => sum + Number(record.v3 || 0), 0) / hourlyRecords.length;
        
        // Format the time label
        const timeLabel = hourTime.toLocaleTimeString('en-US', { 
          hour: '2-digit',
          minute: '2-digit',
          hour12: false 
        });
        
        hourlyData.push({
          time: timeLabel,
          v1: v1Avg,
          v2: v2Avg,
          v3: v3Avg
        });
      }
    }
    
    return hourlyData;
  }
  
  async getGridFrequency(): Promise<any[]> {
    // Get frequency data for the past 24 hours
    const past24Hours = new Date();
    past24Hours.setHours(past24Hours.getHours() - 24);
    
    const frequencyData = await db.select({
      hz: grid1.hz,
      time: grid1.time
    })
    .from(grid1)
    .where(sql`time >= ${past24Hours}`)
    .orderBy(grid1.time);
    
    // Transform data for chart display (hourly intervals)
    const hourlyData = [];
    const hours = 24;
    
    for (let i = 0; i < hours; i++) {
      const hourTime = new Date();
      hourTime.setHours(hourTime.getHours() - hours + i);
      
      // Find records for this hour
      const hourStart = new Date(hourTime);
      hourStart.setMinutes(0, 0, 0);
      const hourEnd = new Date(hourTime);
      hourEnd.setMinutes(59, 59, 999);
      
      // Filter frequency data for this hour
      const hourlyRecords = frequencyData.filter(
        record => record.time >= hourStart && record.time <= hourEnd
      );
      
      if (hourlyRecords.length > 0) {
        // Calculate average frequency
        const hzAvg = hourlyRecords.reduce((sum, record) => sum + Number(record.hz || 0), 0) / hourlyRecords.length;
        
        // Format the time label
        const timeLabel = hourTime.toLocaleTimeString('en-US', { 
          hour: '2-digit',
          minute: '2-digit',
          hour12: false 
        });
        
        hourlyData.push({
          time: timeLabel,
          frequency: hzAvg
        });
      }
    }
    
    return hourlyData;
  }
  
  async getAlerts(): Promise<Alert[]> {
    return db.select().from(alerts);
  }
  
  async getForecastDays(): Promise<ForecastDay[]> {
    return db.select().from(forecastDays);
  }
  
  async getWeeklyForecast(): Promise<{ weeklyTotal: string; weeklyChange: number }> {
    // Get forecast data
    const forecast = await this.getForecastDays();
    
    if (forecast.length === 0) {
      return { weeklyTotal: "0 kWh", weeklyChange: 0 };
    }
    
    // Calculate total forecasted energy
    let totalEnergy = 0;
    for (const day of forecast) {
      // Extract numeric value from forecast string (e.g., "250kWh" -> 250)
      const match = day.forecast.match(/(\d+)/);
      if (match) {
        totalEnergy += Number(match[1]);
      }
    }
    
    // Calculate average change
    const avgChange = forecast.reduce((sum, day) => sum + Number(day.comparison), 0) / forecast.length;
    
    return {
      weeklyTotal: `${totalEnergy} kWh`,
      weeklyChange: Number(avgChange.toFixed(1))
    };
  }
  
  async getWeatherForecast(): Promise<any[]> {
    // Get weather data for forecasting
    const weatherData = await this.getWeatherData();
    
    if (weatherData.length === 0) {
      return [];
    }
    
    // Generate a 5-day forecast based on current weather
    const forecast = [];
    const now = new Date();
    
    for (let i = 0; i < 5; i++) {
      const forecastDate = new Date(now);
      forecastDate.setDate(now.getDate() + i);
      
      const dateString = forecastDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      
      // Use random weather condition from the existing weather data
      const randomWeather = weatherData[Math.floor(Math.random() * weatherData.length)];
      
      forecast.push({
        date: dateString,
        condition: randomWeather.condition,
        temperature: randomWeather.temperature,
        precipitation: Math.random() * 20
      });
    }
    
    return forecast;
  }
  
  async getSolarRadiation(): Promise<any[]> {
    // Get weather data for solar radiation estimates
    const weatherData = await this.getWeatherData();
    
    if (weatherData.length === 0) {
      return [];
    }
    
    // Generate hourly solar radiation data based on weather conditions
    const hourlyData = [];
    const hours = 24;
    
    // Base radiation levels based on weather condition
    const radiationMap: Record<string, number> = {
      "Sunny": 900,
      "Partly Cloudy": 600,
      "Cloudy": 300,
      "Rainy": 100
    };
    
    for (let i = 0; i < hours; i++) {
      const hourTime = new Date();
      hourTime.setHours(hourTime.getHours() - hours + i);
      
      // Format the time label
      const timeLabel = hourTime.toLocaleTimeString('en-US', { 
        hour: '2-digit',
        minute: '2-digit',
        hour12: false 
      });
      
      // Time of day affects radiation (peak at noon)
      const hour = hourTime.getHours();
      let timeMultiplier = 0;
      
      if (hour >= 6 && hour <= 18) {
        // Daylight hours (6am to 6pm)
        // Calculate peak at noon (hour 12)
        timeMultiplier = 1 - Math.abs(hour - 12) / 6;
      }
      
      // Use random weather from the data
      const randomWeather = weatherData[Math.floor(Math.random() * weatherData.length)];
      const baseRadiation = radiationMap[randomWeather.condition] || 300;
      
      // Calculate radiation value
      const radiation = Math.round(baseRadiation * timeMultiplier);
      
      hourlyData.push({
        time: timeLabel,
        radiation: radiation
      });
    }
    
    return hourlyData;
  }
}

export const storage = new DatabaseStorage();