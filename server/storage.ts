import { 
  weatherData, 
  kpis, 
  systemComponents, 
  generatorGroups,
  alerts,
  forecastDays
} from './mock-data';
import * as db from './db';

export const storage = {
  async getWeatherData() {
    return weatherData;
  },

  async getKpis() {
    return kpis;
  },

  async getSystemComponents() {
    return systemComponents;
  },

  async getGeneratorGroups() {
    return generatorGroups;
  },

  async getGeneratorTotalOutput() {
    return "7.4 kW";
  },

  async getGeneratorPerformanceHourly() {
    return [];
  },

  async getGeneratorTemperature() {
    return { current: 42, max: 80, min: 20 };
  },

  async getGridStatus() {
    return { status: "Connected", lastChecked: new Date().toISOString() };
  },

  async getGridVoltage() {
    return await db.getVoltageData('grid1');
  },

  async getGridFrequency() {
    return await db.getFrequencyData('grid1');
  },

  async getAlerts() {
    return alerts;
  },

  async getForecastDays() {
    return forecastDays;
  },

  async getWeeklyForecast() {
    return {
      weeklyTotal: 280.5,
      weeklyChange: 5.2
    };
  },

  async getEnergyHistoryDaily() {
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => ({
      date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      production: Math.random() * 50,
      consumption: Math.random() * 40
    })).reverse();
  },

  async getEnergyHistoryMonthly() {
    return [];
  },

  async getEnergyHistoryYearly() {
    return [];
  },

  async getEnergyDistribution() {
    const sources = [
      { name: "Solar", value: Math.random() * 0.5 },
      { name: "Grid", value: Math.random() * 0.3 },
      { name: "Battery", value: Math.random() * 0.2 }
    ];
    return sources;
  },

  async getWeatherForecast() {
    return [
      { time: "Now", temp: 25, condition: "Sunny" },
      { time: "1PM", temp: 27, condition: "Partly Cloudy" },
      { time: "2PM", temp: 26, condition: "Cloudy" }
    ];
  },

  async getSolarRadiation() {
    return [
      { time: "9AM", value: 400 },
      { time: "10AM", value: 600 },
      { time: "11AM", value: 800 }
    ];
  }
};