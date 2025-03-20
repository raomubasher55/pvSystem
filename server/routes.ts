import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  // Updated KPI data endpoint using storage implementation
  app.get("/api/kpis", async (req, res) => {
    try {
      const kpis = await storage.getKpis();
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch KPI data" });
    }
  });

  // Source-specific data endpoint
  app.get("/api/source/:type", async (req, res) => {
    try {
      // Use getEnergyDistribution to get all source data
      const allSources = await storage.getEnergyDistribution();
      // Find the requested source
      const sourceType = req.params.type;
      const sourceData = allSources.find(source => 
        source.name.toLowerCase() === sourceType.toLowerCase()
      );
      
      if (!sourceData) {
        return res.status(404).json({ error: `Source ${sourceType} not found` });
      }
      
      res.json(sourceData);
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch ${req.params.type} data` });
    }
  });

  // Updated energy data endpoints
  app.get("/api/energy/daily", async (req, res) => {
    try {
      // Use the new storage interface method instead of the direct db method
      const energyData = await storage.getEnergyHistoryDaily();
      res.json(energyData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch energy data" });
    }
  });
  
  // New endpoint for energy chart data with hourly time points
  app.get("/api/energy/chart", async (req, res) => {
    try {
      const chartData = await storage.getEnergyChartData();
      res.json(chartData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch energy chart data" });
    }
  });

  app.get("/api/energy/distribution", async (req, res) => {
    try {
      // Use the storage implementation for consistency
      const distributionData = await storage.getEnergyDistribution();
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
      const timeRange = req.query.timeRange as string || 'last-24h';
      const performanceData = await storage.getGeneratorPerformanceHourly(timeRange);
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
      const timeRange = req.query.timeRange as string || 'last-24h';
      const gridStatus = await storage.getGridStatus(timeRange);
      res.json(gridStatus);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid status" });
    }
  });

  app.get("/api/grid/voltage", async (req, res) => {
    try {
      const voltageData = await storage.getGridVoltage();
      res.json(voltageData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid voltage data" });
    }
  });

  app.get("/api/grid/frequency", async (req, res) => {
    try {
      // For now, returning a static frequency dataset since we don't have a dedicated method
      const frequencyData = [
        { time: "12 AM", value: 50.1 },
        { time: "3 AM", value: 50.2 },
        { time: "6 AM", value: 50.0 },
        { time: "9 AM", value: 49.9 },
        { time: "12 PM", value: 50.0 },
        { time: "3 PM", value: 50.1 },
        { time: "6 PM", value: 50.2 },
        { time: "9 PM", value: 50.0 }
      ];
      res.json(frequencyData);
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
      // Return static weather forecast data for now
      const forecast = [
        { day: "Today", condition: "Sunny", high: 28, low: 16 },
        { day: "Tomorrow", condition: "Partly Cloudy", high: 26, low: 15 },
        { day: "Wednesday", condition: "Cloudy", high: 24, low: 14 },
        { day: "Thursday", condition: "Sunny", high: 29, low: 17 },
        { day: "Friday", condition: "Sunny", high: 30, low: 18 }
      ];
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weather forecast" });
    }
  });

  app.get("/api/weather/solar", async (req, res) => {
    try {
      // Return static solar radiation data for now
      const solarData = [
        { time: "6 AM", value: 100 },
        { time: "7 AM", value: 250 },
        { time: "8 AM", value: 400 },
        { time: "9 AM", value: 550 },
        { time: "10 AM", value: 700 },
        { time: "11 AM", value: 820 },
        { time: "12 PM", value: 900 },
        { time: "1 PM", value: 950 },
        { time: "2 PM", value: 880 },
        { time: "3 PM", value: 750 },
        { time: "4 PM", value: 600 },
        { time: "5 PM", value: 450 },
        { time: "6 PM", value: 280 },
        { time: "7 PM", value: 100 },
        { time: "8 PM", value: 0 }
      ];
      res.json(solarData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch solar radiation data" });
    }
  });

  return httpServer;
}