import { db } from "./server/db";
import { 
  grid1, grid2, generator1, generator2, inverter1, inverter2,
  alerts, forecastDays
} from "./shared/schema";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
    const kwh_import = Math.random() * 100;
    const kwh_export = Math.random() * 200;
    const kvarh_import = Math.random() * 50;
    const kvarh_export = Math.random() * 30;
    const hz = 50 + Math.random() * 0.5 - 0.25;
    
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

// Main seed function
async function seedDatabase() {
  try {
    // Generate time-series data for each source (reduced count to avoid timeout)
    const grid1Data = generatePowerTimeSeriesData(6, 15, 5);
    const grid2Data = generatePowerTimeSeriesData(6, 18, 4);
    const generator1Data = generatePowerTimeSeriesData(6, 30, 8);
    const generator2Data = generatePowerTimeSeriesData(6, 25, 6);
    const inverter1Data = generatePowerTimeSeriesData(6, 12, 3);
    const inverter2Data = generatePowerTimeSeriesData(6, 10, 2);
    
    // Sample alerts
    const sampleAlerts = [
      { status: "Critical", description: "Generator 1 temperature high", component: "Generator 1", time: "2 hours ago" },
      { status: "Warning", description: "Grid voltage fluctuation", component: "Grid 1", time: "3 hours ago" },
      { status: "Info", description: "Inverter 2 firmware updated", component: "Inverter 2", time: "1 day ago" },
      { status: "Critical", description: "Backup battery low", component: "Battery Bank", time: "5 hours ago" },
      { status: "Warning", description: "Solar panel efficiency reduced", component: "Solar Array", time: "12 hours ago" }
    ];
    
    // Sample forecast days
    const sampleForecastDays = [
      { date: "Today", weather: "Sunny", forecast: "Excellent generation expected", comparison: 15.4 },
      { date: "Tomorrow", weather: "Partly Cloudy", forecast: "Good generation conditions", comparison: 8.2 },
      { date: "Wednesday", weather: "Cloudy", forecast: "Below average output expected", comparison: -5.1 },
      { date: "Thursday", weather: "Rain", forecast: "Poor generation conditions", comparison: -12.3 },
      { date: "Friday", weather: "Sunny", forecast: "Excellent generation expected", comparison: 14.8 }
    ];
    
    // Insert grid1 data
    console.log("Seeding grid1 data...");
    for (const item of grid1Data) {
      await db.insert(grid1).values({
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
        kvarh_export: String(item.kvarh_export),
        time: item.time
      });
    }
    
    // Insert grid2 data
    console.log("Seeding grid2 data...");
    for (const item of grid2Data) {
      await db.insert(grid2).values({
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
        kvarh_export: String(item.kvarh_export),
        time: item.time
      });
    }
    
    // Insert generator1 data
    console.log("Seeding generator1 data...");
    for (const item of generator1Data) {
      await db.insert(generator1).values({
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
        kvarh_export: String(item.kvarh_export),
        time: item.time
      });
    }
    
    // Insert generator2 data
    console.log("Seeding generator2 data...");
    for (const item of generator2Data) {
      await db.insert(generator2).values({
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
        kvarh_export: String(item.kvarh_export),
        time: item.time
      });
    }
    
    // Insert inverter1 data
    console.log("Seeding inverter1 data...");
    for (const item of inverter1Data) {
      await db.insert(inverter1).values({
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
        kvarh_export: String(item.kvarh_export),
        time: item.time
      });
    }
    
    // Insert inverter2 data
    console.log("Seeding inverter2 data...");
    for (const item of inverter2Data) {
      await db.insert(inverter2).values({
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
        kvarh_export: String(item.kvarh_export),
        time: item.time
      });
    }
    
    // Insert alerts
    console.log("Seeding alerts...");
    for (const alert of sampleAlerts) {
      await db.insert(alerts).values(alert);
    }
    
    // Insert forecast days
    console.log("Seeding forecast days...");
    for (const day of sampleForecastDays) {
      await db.insert(forecastDays).values({
        date: day.date,
        weather: day.weather,
        forecast: day.forecast,
        comparison: String(day.comparison)
      });
    }
    
    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();