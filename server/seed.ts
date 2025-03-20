import { db, pool } from "./db";
import { 
  grid1, grid2, generator1, generator2, inverter1, inverter2, 
  weatherData, kpis, systemComponents, generatorGroups, 
  alerts, forecastDays, gridData, users
} from "@shared/schema";

// Helper to create sample time-series data
function generatePowerTimeSeriesData(count: number, baseValue: number, variance: number) {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - (count - i) * 60 * 60 * 1000); // hours ago
    
    // Generate slightly different values with some variance
    const value = baseValue + (Math.random() * variance * 2) - variance;
    const v1 = 220 + Math.random() * 10 - 5;
    const v2 = 220 + Math.random() * 10 - 5;
    const v3 = 220 + Math.random() * 10 - 5;
    const v12 = 380 + Math.random() * 10 - 5;
    const v23 = 380 + Math.random() * 10 - 5;
    const v31 = 380 + Math.random() * 10 - 5;
    const a1 = value / 3 / v1;
    const a2 = value / 3 / v2;
    const a3 = value / 3 / v3;
    const pf1 = 0.8 + Math.random() * 0.15;
    const pf2 = 0.8 + Math.random() * 0.15;
    const pf3 = 0.8 + Math.random() * 0.15;
    const pft = (pf1 + pf2 + pf3) / 3;
    const kw1 = v1 * a1 * pf1 / 1000;
    const kw2 = v2 * a2 * pf2 / 1000;
    const kw3 = v3 * a3 * pf3 / 1000;
    const kwt = kw1 + kw2 + kw3;
    const kva1 = v1 * a1 / 1000;
    const kva2 = v2 * a2 / 1000;
    const kva3 = v3 * a3 / 1000;
    const kvat = kva1 + kva2 + kva3;
    const kvar1 = Math.sqrt(Math.pow(kva1, 2) - Math.pow(kw1, 2));
    const kvar2 = Math.sqrt(Math.pow(kva2, 2) - Math.pow(kw2, 2));
    const kvar3 = Math.sqrt(Math.pow(kva3, 2) - Math.pow(kw3, 2));
    const kvart = kvar1 + kvar2 + kvar3;
    const hz = 50 + Math.random() * 0.4 - 0.2;
    const kwh_import = 100 + i * 5 + Math.random() * 10;
    const kwh_export = 50 + i * 3 + Math.random() * 5;
    const kvarh_import = 30 + i * 2 + Math.random() * 5;
    const kvarh_export = 15 + i * 1 + Math.random() * 3;
    
    data.push({
      v1, v2, v3, v12, v23, v31, a1, a2, a3,
      kva1, kva2, kva3, kvat, kvar1, kvar2, kvar3, kvart,
      kw1, kw2, kw3, kwt, pf1, pf2, pf3, pft, hz,
      kwh_import, kwh_export, kvarh_import, kvarh_export,
      time
    });
  }
  
  return data;
}

// Generate and seed weather data
async function seedWeatherData() {
  const locations = ["Site 1", "Site 2", "Site 3"];
  const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"];
  const solarIntensity = ["High", "Medium", "Low"];
  
  for (const location of locations) {
    await db.insert(weatherData).values({
      location,
      temperature: 25 + Math.random() * 10 - 5,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: 40 + Math.random() * 30,
      wind: Math.random() * 20,
      uvIndex: Math.random() * 10,
      visibility: 5 + Math.random() * 5,
      solarIntensity: solarIntensity[Math.floor(Math.random() * solarIntensity.length)]
    });
  }
}

// Generate and seed system components
async function seedSystemComponents() {
  const components = [
    { name: "Main Transformer", details: "500kVA, 11kV/415V", status: "Online", output: "450kVA", type: "transformer" },
    { name: "Backup Transformer", details: "250kVA, 11kV/415V", status: "Standby", output: "0kVA", type: "transformer" },
    { name: "Grid Connection 1", details: "11kV Line", status: "Active", output: "180kW", type: "connection" },
    { name: "Grid Connection 2", details: "11kV Line", status: "Active", output: "120kW", type: "connection" },
    { name: "Main Distribution Panel", details: "600A", status: "Normal", output: "450A", type: "panel" },
    { name: "Emergency Panel", details: "200A", status: "Normal", output: "0A", type: "panel" }
  ];
  
  for (const component of components) {
    await db.insert(systemComponents).values(component);
  }
}

// Generate and seed generator groups
async function seedGeneratorGroups() {
  const groups = [
    { name: "Generator Group A", output: "120kW", efficiency: 92 },
    { name: "Generator Group B", output: "80kW", efficiency: 88 },
    { name: "Generator Group C", output: "50kW", efficiency: 85 }
  ];
  
  for (const group of groups) {
    await db.insert(generatorGroups).values(group);
  }
}

// Generate and seed alerts
async function seedAlerts() {
  const alertData = [
    { status: "Critical", description: "Grid voltage fluctuation detected", component: "Grid Connection 1", time: "10 minutes ago" },
    { status: "Warning", description: "Generator temperature rising", component: "Generator Group A", time: "1 hour ago" },
    { status: "Info", description: "Solar panel cleaning scheduled", component: "Inverter 1", time: "3 hours ago" },
    { status: "Resolved", description: "Battery bank connection issue", component: "Battery Storage", time: "1 day ago" }
  ];
  
  for (const alert of alertData) {
    await db.insert(alerts).values(alert);
  }
}

// Generate and seed forecast days
async function seedForecastDays() {
  const today = new Date();
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    const dateString = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    
    const weatherConditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"];
    const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    const forecast = `${Math.floor(250 + Math.random() * 100)}kWh`;
    const comparison = Math.random() * 20 - 10; // -10% to +10%
    
    days.push({
      date: dateString,
      weather,
      forecast,
      comparison
    });
  }
  
  for (const day of days) {
    await db.insert(forecastDays).values(day);
  }
}

// Main seed function
async function seedDatabase() {
  try {
    console.log("Starting database seeding...");
    
    // Seed power source data (past 7 days with hourly data)
    // Update the generatePowerTimeSeriesData function to accept a timeOffset parameter
    const generateMoreData = (count: number, baseValue: number, variance: number, timeOffset: number = 0) => {
      return generatePowerTimeSeriesData(count, baseValue, variance).map(item => {
        if (timeOffset > 0) {
          const newTime = new Date(item.time);
          newTime.setHours(newTime.getHours() - timeOffset);
          return { ...item, time: newTime };
        }
        return item;
      });
    };

    const grid1Data = [
      ...generatePowerTimeSeriesData(24, 180, 20), // Last 24 hours
      ...generateMoreData(6 * 24, 180, 30, 24) // Previous 6 days
    ];
    const grid2Data = [
      ...generatePowerTimeSeriesData(24, 120, 15), // Last 24 hours
      ...generateMoreData(6 * 24, 120, 25, 24) // Previous 6 days
    ];
    const generator1Data = [
      ...generatePowerTimeSeriesData(24, 80, 10), // Last 24 hours
      ...generateMoreData(6 * 24, 80, 15, 24) // Previous 6 days
    ];
    const generator2Data = [
      ...generatePowerTimeSeriesData(24, 50, 8), // Last 24 hours
      ...generateMoreData(6 * 24, 50, 12, 24) // Previous 6 days
    ];
    const inverter1Data = [
      ...generatePowerTimeSeriesData(24, 40, 5), // Last 24 hours
      ...generateMoreData(6 * 24, 40, 8, 24) // Previous 6 days
    ];
    const inverter2Data = [
      ...generatePowerTimeSeriesData(24, 25, 3), // Last 24 hours
      ...generateMoreData(6 * 24, 25, 5, 24) // Previous 6 days
    ];
    
    // Bulk insert for each source
    for (const item of grid1Data) {
      await db.insert(grid1).values(item);
    }
    
    for (const item of grid2Data) {
      await db.insert(grid2).values(item);
    }
    
    for (const item of generator1Data) {
      await db.insert(generator1).values(item);
    }
    
    for (const item of generator2Data) {
      await db.insert(generator2).values(item);
    }
    
    for (const item of inverter1Data) {
      await db.insert(inverter1).values(item);
    }
    
    for (const item of inverter2Data) {
      await db.insert(inverter2).values(item);
    }
    
    // Seed other data
    await seedWeatherData();
    await seedSystemComponents();
    await seedGeneratorGroups();
    await seedAlerts();
    await seedForecastDays();
    
    // Seed a test user
    await db.insert(users).values({
      username: "admin",
      password: "password123"
    });
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Execute the seed function
seedDatabase();