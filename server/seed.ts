import { db } from "./db";
import { 
  grid1, grid2, generator1, generator2, inverter1, inverter2,
  alerts, forecastDays
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

// All previous seed functions for other tables are removed as requested
// We'll only keep the power source tables (grid1, grid2, generator1, generator2, inverter1, inverter2)

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

    // Minimal data for testing - just 3 time points per source
    const grid1Data = generatePowerTimeSeriesData(3, 180, 20);
    const grid2Data = generatePowerTimeSeriesData(3, 120, 15);
    const generator1Data = generatePowerTimeSeriesData(3, 80, 10);
    const generator2Data = generatePowerTimeSeriesData(3, 50, 8);
    const inverter1Data = generatePowerTimeSeriesData(3, 40, 5);
    const inverter2Data = generatePowerTimeSeriesData(3, 25, 3);
    
    // Bulk insert for each source
    console.log("Seeding grid1 data...");
    for (const item of grid1Data) {
      await db.insert(grid1).values({
        ...item,
        v1: String(item.v1),
        v2: String(item.v2),
        v3: String(item.v3),
        v12: String(item.v12),
        v23: String(item.v23),
        v31: String(item.v31),
        a1: String(item.a1),
        a2: String(item.a2),
        a3: String(item.a3),
        kva1: String(item.kva1),
        kva2: String(item.kva2),
        kva3: String(item.kva3),
        kvat: String(item.kvat),
        kvar1: String(item.kvar1),
        kvar2: String(item.kvar2),
        kvar3: String(item.kvar3),
        kvart: String(item.kvart),
        kw1: String(item.kw1),
        kw2: String(item.kw2),
        kw3: String(item.kw3),
        kwt: String(item.kwt),
        pf1: String(item.pf1),
        pf2: String(item.pf2),
        pf3: String(item.pf3),
        pft: String(item.pft),
        hz: String(item.hz),
        kwh_import: String(item.kwh_import),
        kwh_export: String(item.kwh_export),
        kvarh_import: String(item.kvarh_import),
        kvarh_export: String(item.kvarh_export)
      });
    }
    
    console.log("Seeding grid2 data...");
    for (const item of grid2Data) {
      await db.insert(grid2).values({
        ...item,
        v1: String(item.v1),
        v2: String(item.v2),
        v3: String(item.v3),
        v12: String(item.v12),
        v23: String(item.v23),
        v31: String(item.v31),
        a1: String(item.a1),
        a2: String(item.a2),
        a3: String(item.a3),
        kva1: String(item.kva1),
        kva2: String(item.kva2),
        kva3: String(item.kva3),
        kvat: String(item.kvat),
        kvar1: String(item.kvar1),
        kvar2: String(item.kvar2),
        kvar3: String(item.kvar3),
        kvart: String(item.kvart),
        kw1: String(item.kw1),
        kw2: String(item.kw2),
        kw3: String(item.kw3),
        kwt: String(item.kwt),
        pf1: String(item.pf1),
        pf2: String(item.pf2),
        pf3: String(item.pf3),
        pft: String(item.pft),
        hz: String(item.hz),
        kwh_import: String(item.kwh_import),
        kwh_export: String(item.kwh_export),
        kvarh_import: String(item.kvarh_import),
        kvarh_export: String(item.kvarh_export)
      });
    }
    
    console.log("Seeding generator1 data...");
    for (const item of generator1Data) {
      await db.insert(generator1).values({
        ...item,
        v1: String(item.v1),
        v2: String(item.v2),
        v3: String(item.v3),
        v12: String(item.v12),
        v23: String(item.v23),
        v31: String(item.v31),
        a1: String(item.a1),
        a2: String(item.a2),
        a3: String(item.a3),
        kva1: String(item.kva1),
        kva2: String(item.kva2),
        kva3: String(item.kva3),
        kvat: String(item.kvat),
        kvar1: String(item.kvar1),
        kvar2: String(item.kvar2),
        kvar3: String(item.kvar3),
        kvart: String(item.kvart),
        kw1: String(item.kw1),
        kw2: String(item.kw2),
        kw3: String(item.kw3),
        kwt: String(item.kwt),
        pf1: String(item.pf1),
        pf2: String(item.pf2),
        pf3: String(item.pf3),
        pft: String(item.pft),
        hz: String(item.hz),
        kwh_import: String(item.kwh_import),
        kwh_export: String(item.kwh_export),
        kvarh_import: String(item.kvarh_import),
        kvarh_export: String(item.kvarh_export)
      });
    }
    
    console.log("Seeding generator2 data...");
    for (const item of generator2Data) {
      await db.insert(generator2).values({
        ...item,
        v1: String(item.v1),
        v2: String(item.v2),
        v3: String(item.v3),
        v12: String(item.v12),
        v23: String(item.v23),
        v31: String(item.v31),
        a1: String(item.a1),
        a2: String(item.a2),
        a3: String(item.a3),
        kva1: String(item.kva1),
        kva2: String(item.kva2),
        kva3: String(item.kva3),
        kvat: String(item.kvat),
        kvar1: String(item.kvar1),
        kvar2: String(item.kvar2),
        kvar3: String(item.kvar3),
        kvart: String(item.kvart),
        kw1: String(item.kw1),
        kw2: String(item.kw2),
        kw3: String(item.kw3),
        kwt: String(item.kwt),
        pf1: String(item.pf1),
        pf2: String(item.pf2),
        pf3: String(item.pf3),
        pft: String(item.pft),
        hz: String(item.hz),
        kwh_import: String(item.kwh_import),
        kwh_export: String(item.kwh_export),
        kvarh_import: String(item.kvarh_import),
        kvarh_export: String(item.kvarh_export)
      });
    }
    
    console.log("Seeding inverter1 data...");
    for (const item of inverter1Data) {
      await db.insert(inverter1).values({
        ...item,
        v1: String(item.v1),
        v2: String(item.v2),
        v3: String(item.v3),
        v12: String(item.v12),
        v23: String(item.v23),
        v31: String(item.v31),
        a1: String(item.a1),
        a2: String(item.a2),
        a3: String(item.a3),
        kva1: String(item.kva1),
        kva2: String(item.kva2),
        kva3: String(item.kva3),
        kvat: String(item.kvat),
        kvar1: String(item.kvar1),
        kvar2: String(item.kvar2),
        kvar3: String(item.kvar3),
        kvart: String(item.kvart),
        kw1: String(item.kw1),
        kw2: String(item.kw2),
        kw3: String(item.kw3),
        kwt: String(item.kwt),
        pf1: String(item.pf1),
        pf2: String(item.pf2),
        pf3: String(item.pf3),
        pft: String(item.pft),
        hz: String(item.hz),
        kwh_import: String(item.kwh_import),
        kwh_export: String(item.kwh_export),
        kvarh_import: String(item.kvarh_import),
        kvarh_export: String(item.kvarh_export)
      });
    }
    
    console.log("Seeding inverter2 data...");
    for (const item of inverter2Data) {
      await db.insert(inverter2).values({
        ...item,
        v1: String(item.v1),
        v2: String(item.v2),
        v3: String(item.v3),
        v12: String(item.v12),
        v23: String(item.v23),
        v31: String(item.v31),
        a1: String(item.a1),
        a2: String(item.a2),
        a3: String(item.a3),
        kva1: String(item.kva1),
        kva2: String(item.kva2),
        kva3: String(item.kva3),
        kvat: String(item.kvat),
        kvar1: String(item.kvar1),
        kvar2: String(item.kvar2),
        kvar3: String(item.kvar3),
        kvart: String(item.kvart),
        kw1: String(item.kw1),
        kw2: String(item.kw2),
        kw3: String(item.kw3),
        kwt: String(item.kwt),
        pf1: String(item.pf1),
        pf2: String(item.pf2),
        pf3: String(item.pf3),
        pft: String(item.pft),
        hz: String(item.hz),
        kwh_import: String(item.kwh_import),
        kwh_export: String(item.kwh_export),
        kvarh_import: String(item.kvarh_import),
        kvarh_export: String(item.kvarh_export)
      });
    }
    
    // Seed alerts data
    console.log("Seeding alerts data...");
    const alertsData = [
      {
        status: "warning",
        description: "Generator 1 output below expected level",
        component: "Generator 1",
        time: "10:25 AM",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      },
      {
        status: "critical",
        description: "Grid connection interrupted",
        component: "Grid 1",
        time: "9:12 AM",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
      },
      {
        status: "info",
        description: "Scheduled maintenance completed",
        component: "System",
        time: "Yesterday",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
      },
      {
        status: "warning",
        description: "Battery storage at 15% capacity",
        component: "Battery Bank",
        time: "Yesterday",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28) // 1 day 4 hours ago
      },
      {
        status: "critical",
        description: "Inverter 2 temperature exceeding threshold",
        component: "Inverter 2",
        time: "Mar 18",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50) // 2 days 2 hours ago
      }
    ];
    
    for (const alert of alertsData) {
      await db.insert(alerts).values(alert);
    }
    
    // Seed forecast days data
    console.log("Seeding forecast days data...");
    const forecastDaysData = [
      {
        date: "Today",
        weather: "Sunny",
        forecast: "72.4 kWh",
        comparison: "5.2"
      },
      {
        date: "Tomorrow",
        weather: "Partly Cloudy",
        forecast: "64.8 kWh",
        comparison: "-3.1"
      },
      {
        date: "Wednesday",
        weather: "Cloudy",
        forecast: "52.1 kWh",
        comparison: "-12.6"
      },
      {
        date: "Thursday",
        weather: "Sunny",
        forecast: "70.2 kWh",
        comparison: "2.3"
      },
      {
        date: "Friday",
        weather: "Sunny",
        forecast: "71.8 kWh",
        comparison: "4.2"
      },
      {
        date: "Saturday",
        weather: "Rainy",
        forecast: "45.3 kWh",
        comparison: "-18.7"
      },
      {
        date: "Sunday",
        weather: "Partly Cloudy",
        forecast: "62.5 kWh",
        comparison: "-5.8"
      }
    ];
    
    for (const forecast of forecastDaysData) {
      await db.insert(forecastDays).values(forecast);
    }
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // No need to close connection with postgres-js
    console.log("Seed process completed");
  }
}

// Execute the seed function
seedDatabase();