import { 
  users, type User, type InsertUser,
  Weather, Kpi, SystemComponent, GeneratorGroup,
  Alert, ForecastDay, EnergyRecord, GridRecord
} from "@shared/schema";
import {
  weatherData,
  kpis,
  systemComponents,
  generatorGroups,
  gridData,
  alerts,
  forecastDays,
  energyData
} from "./mock-data";

// Interface for the storage operations
export interface IStorage {
  // User operations (from original schema)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Weather data operations
  getWeatherData(): Promise<any>;
  
  // KPI operations
  getKpis(): Promise<any[]>;
  
  // Energy data operations
  getEnergyData(): Promise<any[]>;
  getEnergyDistribution(): Promise<any[]>;
  getEnergyHistoryDaily(): Promise<any[]>;
  getEnergyHistoryMonthly(): Promise<any[]>;
  getEnergyHistoryYearly(): Promise<any[]>;
  
  // System status operations
  getSystemComponents(): Promise<any[]>;
  
  // Generator operations
  getGeneratorGroups(): Promise<any[]>;
  getGeneratorTotalOutput(): Promise<string>;
  getGeneratorPerformanceHourly(): Promise<any[]>;
  getGeneratorTemperature(): Promise<any[]>;
  
  // Grid operations
  getGridStatus(): Promise<any>;
  getGridVoltage(): Promise<any[]>;
  getGridFrequency(): Promise<any[]>;
  
  // Alerts operations
  getAlerts(): Promise<any[]>;
  
  // Forecast operations
  getForecastDays(): Promise<any[]>;
  getWeeklyForecast(): Promise<{ weeklyTotal: string, weeklyChange: number }>;
  
  // Weather forecast operations
  getWeatherForecast(): Promise<any[]>;
  getSolarRadiation(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  // User methods (from original storage)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Weather data methods
  async getWeatherData(): Promise<any> {
    return weatherData;
  }

  // KPI methods
  async getKpis(): Promise<any[]> {
    return kpis;
  }

  // Energy data methods
  async getEnergyData(): Promise<any[]> {
    return [
      { time: "6am", production: 0, consumption: 1.2, grid: 1.2 },
      { time: "8am", production: 2, consumption: 1.5, grid: -0.5 },
      { time: "10am", production: 5.5, consumption: 2.8, grid: -2.7 },
      { time: "12pm", production: 8.2, consumption: 3.5, grid: -4.7 },
      { time: "2pm", production: 7.8, consumption: 4.2, grid: -3.6 },
      { time: "4pm", production: 5.2, consumption: 3.8, grid: -1.4 },
      { time: "6pm", production: 1.8, consumption: 4.5, grid: 2.7 },
      { time: "8pm", production: 0, consumption: 3.2, grid: 3.2 }
    ];
  }

  async getEnergyDistribution(): Promise<any[]> {
    return [
      { name: "Home Use", value: 45 },
      { name: "Grid Export", value: 35 },
      { name: "Battery Charging", value: 20 }
    ];
  }

  async getEnergyHistoryDaily(): Promise<any[]> {
    return [
      { date: "Mon", production: 42.5, consumption: 35.2, gridExport: 7.3 },
      { date: "Tue", production: 38.9, consumption: 33.7, gridExport: 5.2 },
      { date: "Wed", production: 32.3, consumption: 36.1, gridExport: 0 },
      { date: "Thu", production: 44.7, consumption: 37.8, gridExport: 6.9 },
      { date: "Fri", production: 45.2, consumption: 34.5, gridExport: 10.7 },
      { date: "Sat", production: 39.8, consumption: 30.2, gridExport: 9.6 },
      { date: "Sun", production: 41.3, consumption: 32.8, gridExport: 8.5 }
    ];
  }

  async getEnergyHistoryMonthly(): Promise<any[]> {
    return [
      { month: "Jan", production: 850, consumption: 920, gridExport: 0 },
      { month: "Feb", production: 950, consumption: 880, gridExport: 70 },
      { month: "Mar", production: 1100, consumption: 920, gridExport: 180 },
      { month: "Apr", production: 1350, consumption: 980, gridExport: 370 },
      { month: "May", production: 1500, consumption: 1050, gridExport: 450 },
      { month: "Jun", production: 1580, consumption: 1120, gridExport: 460 }
    ];
  }

  async getEnergyHistoryYearly(): Promise<any[]> {
    return [
      { year: "2018", production: 10200, consumption: 11500, gridExport: 0 },
      { year: "2019", production: 12500, consumption: 11800, gridExport: 700 },
      { year: "2020", production: 13100, consumption: 12000, gridExport: 1100 },
      { year: "2021", production: 13800, consumption: 12200, gridExport: 1600 },
      { year: "2022", production: 14100, consumption: 12400, gridExport: 1700 },
      { year: "2023", production: 14500, consumption: 12300, gridExport: 2200 }
    ];
  }

  // System status methods
  async getSystemComponents(): Promise<any[]> {
    return systemComponents;
  }

  // Generator methods
  async getGeneratorGroups(): Promise<any[]> {
    return generatorGroups;
  }

  async getGeneratorTotalOutput(): Promise<string> {
    return "8.3 kW";
  }

  async getGeneratorPerformanceHourly(): Promise<any[]> {
    return [
      { time: "6am", roofEast: 0, roofWest: 0, garage: 0, groundArray: 0 },
      { time: "8am", roofEast: 0.6, roofWest: 0.2, garage: 0.4, groundArray: 0.3 },
      { time: "10am", roofEast: 1.8, roofWest: 1.2, garage: 1.2, groundArray: 0.5 },
      { time: "12pm", roofEast: 2.4, roofWest: 3.2, garage: 1.8, groundArray: 0.8 },
      { time: "2pm", roofEast: 2.2, roofWest: 3.1, garage: 1.6, groundArray: 0.8 },
      { time: "4pm", roofEast: 1.4, roofWest: 2.5, garage: 0.8, groundArray: 0.5 },
      { time: "6pm", roofEast: 0.5, roofWest: 0.8, garage: 0.3, groundArray: 0.2 },
      { time: "8pm", roofEast: 0, roofWest: 0, garage: 0, groundArray: 0 }
    ];
  }

  async getGeneratorTemperature(): Promise<any[]> {
    return [
      { time: "6am", roofEast: 65, roofWest: 64, garage: 63, groundArray: 62, ambient: 60 },
      { time: "8am", roofEast: 72, roofWest: 70, garage: 69, groundArray: 68, ambient: 65 },
      { time: "10am", roofEast: 85, roofWest: 82, garage: 80, groundArray: 78, ambient: 72 },
      { time: "12pm", roofEast: 95, roofWest: 93, garage: 90, groundArray: 88, ambient: 80 },
      { time: "2pm", roofEast: 98, roofWest: 96, garage: 94, groundArray: 92, ambient: 84 },
      { time: "4pm", roofEast: 94, roofWest: 92, garage: 90, groundArray: 88, ambient: 82 },
      { time: "6pm", roofEast: 85, roofWest: 83, garage: 81, groundArray: 79, ambient: 75 },
      { time: "8pm", roofEast: 75, roofWest: 73, garage: 72, groundArray: 70, ambient: 68 }
    ];
  }

  // Grid methods
  async getGridStatus(): Promise<any> {
    return {
      import: "3.8",
      importChange: -5,
      export: "12.6",
      exportChange: 12,
      netBalance: "+8.8",
      voltage: "123.4",
      frequency: "60.01",
      chartData: [
        { time: "12am", import: 1.2, export: 0 },
        { time: "3am", import: 0.8, export: 0 },
        { time: "6am", import: 0.5, export: 0 },
        { time: "9am", import: 0.1, export: 1.5 },
        { time: "12pm", import: 0, export: 3.8 },
        { time: "3pm", import: 0, export: 4.2 },
        { time: "6pm", import: 0.3, export: 2.5 },
        { time: "9pm", import: 0.9, export: 0.6 }
      ]
    };
  }

  async getGridVoltage(): Promise<any[]> {
    return [
      { time: "12am", phaseA: 122.5, phaseB: 123.1, phaseC: 122.8 },
      { time: "3am", phaseA: 122.2, phaseB: 122.9, phaseC: 122.5 },
      { time: "6am", phaseA: 121.8, phaseB: 122.4, phaseC: 122.0 },
      { time: "9am", phaseA: 122.0, phaseB: 122.6, phaseC: 122.3 },
      { time: "12pm", phaseA: 123.2, phaseB: 123.8, phaseC: 123.5 },
      { time: "3pm", phaseA: 123.8, phaseB: 124.3, phaseC: 124.0 },
      { time: "6pm", phaseA: 123.5, phaseB: 124.0, phaseC: 123.7 },
      { time: "9pm", phaseA: 123.0, phaseB: 123.5, phaseC: 123.2 }
    ];
  }

  async getGridFrequency(): Promise<any[]> {
    return [
      { time: "12am", frequency: 60.02 },
      { time: "3am", frequency: 60.01 },
      { time: "6am", frequency: 60.00 },
      { time: "9am", frequency: 60.03 },
      { time: "12pm", frequency: 60.05 },
      { time: "3pm", frequency: 60.04 },
      { time: "6pm", frequency: 60.02 },
      { time: "9pm", frequency: 60.01 }
    ];
  }

  // Alerts methods
  async getAlerts(): Promise<any[]> {
    return alerts;
  }

  // Forecast methods
  async getForecastDays(): Promise<any[]> {
    return forecastDays;
  }

  async getWeeklyForecast(): Promise<{ weeklyTotal: string, weeklyChange: number }> {
    return { 
      weeklyTotal: "276.4 kWh", 
      weeklyChange: 4 
    };
  }

  // Weather forecast methods
  async getWeatherForecast(): Promise<any[]> {
    return [
      { day: "Today", highTemp: 86, lowTemp: 72, precipChance: 5 },
      { day: "Tue", highTemp: 84, lowTemp: 70, precipChance: 20 },
      { day: "Wed", highTemp: 78, lowTemp: 68, precipChance: 70 },
      { day: "Thu", highTemp: 82, lowTemp: 69, precipChance: 15 },
      { day: "Fri", highTemp: 85, lowTemp: 72, precipChance: 10 }
    ];
  }

  async getSolarRadiation(): Promise<any[]> {
    return [
      { hour: "6am", radiation: 120, potential: 0.5 },
      { hour: "8am", radiation: 350, potential: 2.2 },
      { hour: "10am", radiation: 650, potential: 5.8 },
      { hour: "12pm", radiation: 880, potential: 8.5 },
      { hour: "2pm", radiation: 820, potential: 8.0 },
      { hour: "4pm", radiation: 560, potential: 5.4 },
      { hour: "6pm", radiation: 220, potential: 2.0 },
      { hour: "8pm", radiation: 30, potential: 0.2 }
    ];
  }
}

export const storage = new MemStorage();
