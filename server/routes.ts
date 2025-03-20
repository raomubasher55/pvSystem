import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  getLatestPowerData,
  getAllSourcesLatestData,
  getHistoricalPowerData,
  getPowerSourceDistribution,
  getVoltageData,
  getCurrentData,
  getPowerFactorData,
  getFrequencyData
} from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Weather API endpoint
  app.get("/api/weather", async (req, res) => {
    try {
      const weatherData = await storage.getWeatherData();
      res.json(weatherData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  // Updated KPI data endpoint to show data from all sources
  app.get("/api/kpis", async (req, res) => {
    try {
      const allSourcesData = await getAllSourcesLatestData();
      const kpis = [];

      // Add total system power KPI
      const totalPower = allSourcesData.reduce((sum, source) => sum + source.kwt, 0);
      kpis.push({
        id: "kpi1",
        title: "Total System Power",
        value: `${totalPower.toFixed(2)} kW`,
        change: 0, // Calculate change if historical data available
        type: "power"
      });

      // Add source-specific KPIs
      allSourcesData.forEach(source => {
        kpis.push({
          id: `kpi_${source.source_type}`,
          title: `${source.source_type.charAt(0).toUpperCase() + source.source_type.slice(1)} Power`,
          value: `${source.kwt.toFixed(2)} kW`,
          change: ((source.kwh_export - source.kwh_import) / source.kwh_import) * 100,
          type: source.source_type
        });
      });

      res.json(kpis);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

  // Source-specific data endpoint
  app.get("/api/source/:type", async (req, res) => {
    try {
      const sourceType = req.params.type;
      const data = await getLatestPowerData(sourceType);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch ${req.params.type} data` });
    }
  });

  // Updated energy data endpoints
  app.get("/api/energy/daily", async (req, res) => {
    try {
      const sourceType = req.query.source as string || 'grid';
      const energyData = await getHistoricalPowerData(sourceType, 24);
      res.json(energyData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch energy data" });
    }
  });

  app.get("/api/energy/distribution", async (req, res) => {
    try {
      const distributionData = await getPowerSourceDistribution();
      res.json(distributionData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch energy distribution data" });
    }
  });

  // System status endpoint
  app.get("/api/system/status", async (req, res) => {
    try {
      const systemStatus = await storage.getSystemComponents();
      res.json(systemStatus);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch system status" });
    }
  });

  // Generator performance endpoint
  app.get("/api/generator/performance", async (req, res) => {
    try {
      const groups = await storage.getGeneratorGroups();
      const totalOutput = await storage.getGeneratorTotalOutput();
      res.json({ groups, totalOutput });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch generator performance" });
    }
  });

  app.get("/api/generator/performance/hourly", async (req, res) => {
    try {
      const performanceData = await storage.getGeneratorPerformanceHourly();
      res.json(performanceData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hourly generator performance" });
    }
  });

  app.get("/api/generator/temperature", async (req, res) => {
    try {
      const temperatureData = await storage.getGeneratorTemperature();
      res.json(temperatureData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch generator temperature data" });
    }
  });

  // Grid status endpoint
  app.get("/api/grid/status", async (req, res) => {
    try {
      const gridStatus = await storage.getGridStatus();
      res.json(gridStatus);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid status" });
    }
  });

  app.get("/api/grid/voltage", async (req, res) => {
    try {
      const voltageData = await getVoltageData();
      const formattedData = voltageData.map(record => ({
        time: new Date(record.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        phaseA: record.v1,
        phaseB: record.v2,
        phaseC: record.v3
      }));
      res.json(formattedData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid voltage data" });
    }
  });

  app.get("/api/grid/frequency", async (req, res) => {
    try {
      const frequencyData = await getFrequencyData();
      const formattedData = frequencyData.map(record => ({
        time: new Date(record.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        frequency: record.hz
      }));
      res.json(formattedData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid frequency data" });
    }
  });

  // Alerts endpoint
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  // Energy forecast endpoint
  app.get("/api/energy/forecast", async (req, res) => {
    try {
      const days = await storage.getForecastDays();
      const { weeklyTotal, weeklyChange } = await storage.getWeeklyForecast();
      res.json({ days, weeklyTotal, weeklyChange });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch energy forecast" });
    }
  });

  // Energy history endpoints
  app.get("/api/energy/history/daily", async (req, res) => {
    try {
      const dailyHistory = await storage.getEnergyHistoryDaily();
      res.json(dailyHistory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch daily energy history" });
    }
  });

  app.get("/api/energy/history/monthly", async (req, res) => {
    try {
      const monthlyHistory = await storage.getEnergyHistoryMonthly();
      res.json(monthlyHistory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch monthly energy history" });
    }
  });

  app.get("/api/energy/history/yearly", async (req, res) => {
    try {
      const yearlyHistory = await storage.getEnergyHistoryYearly();
      res.json(yearlyHistory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch yearly energy history" });
    }
  });

  // Weather forecast endpoint
  app.get("/api/weather/forecast", async (req, res) => {
    try {
      const forecast = await storage.getWeatherForecast();
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weather forecast" });
    }
  });

  app.get("/api/weather/solar", async (req, res) => {
    try {
      const solarData = await storage.getSolarRadiation();
      res.json(solarData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch solar radiation data" });
    }
  });

  return httpServer;
}