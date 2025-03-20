// Script to create MySQL tables for the application

import mysql from 'mysql2/promise';
import { db } from './server/db';
import * as schema from './shared/schema';

// Create each table in the database
async function createTables() {
  console.log('Starting MySQL table creation...');
  
  try {
    // Create a direct connection to execute CREATE TABLE statements
    const connection = await mysql.createConnection({
      host: 'sql12.freesqldatabase.com',
      user: 'sql12768689',
      password: 'mUu4y7Yfk8',
      database: 'sql12768689',
      port: 3306
    });
    
    console.log('Connected to MySQL database');
    
    // Create grid1 table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS grid1 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        v1 DECIMAL(10, 2) NOT NULL,
        v2 DECIMAL(10, 2) NOT NULL,
        v3 DECIMAL(10, 2) NOT NULL,
        v12 DECIMAL(10, 2) NOT NULL,
        v23 DECIMAL(10, 2) NOT NULL,
        v31 DECIMAL(10, 2) NOT NULL,
        a1 DECIMAL(10, 2) NOT NULL,
        a2 DECIMAL(10, 2) NOT NULL,
        a3 DECIMAL(10, 2) NOT NULL,
        kva1 DECIMAL(10, 2) NOT NULL,
        kva2 DECIMAL(10, 2) NOT NULL,
        kva3 DECIMAL(10, 2) NOT NULL,
        kvat DECIMAL(10, 2) NOT NULL,
        kvar1 DECIMAL(10, 2) NOT NULL,
        kvar2 DECIMAL(10, 2) NOT NULL,
        kvar3 DECIMAL(10, 2) NOT NULL,
        kvart DECIMAL(10, 2) NOT NULL,
        kw1 DECIMAL(10, 2) NOT NULL,
        kw2 DECIMAL(10, 2) NOT NULL,
        kw3 DECIMAL(10, 2) NOT NULL,
        kwt DECIMAL(10, 2) NOT NULL,
        pf1 DECIMAL(10, 2) NOT NULL,
        pf2 DECIMAL(10, 2) NOT NULL,
        pf3 DECIMAL(10, 2) NOT NULL,
        pft DECIMAL(10, 2) NOT NULL,
        hz DECIMAL(10, 2) NOT NULL,
        kwh_import DECIMAL(10, 2) NOT NULL,
        kwh_export DECIMAL(10, 2) NOT NULL,
        kvarh_import DECIMAL(10, 2) NOT NULL,
        kvarh_export DECIMAL(10, 2) NOT NULL,
        time DATETIME NOT NULL
      )
    `);
    console.log('Created grid1 table');
    
    // Create grid2 table - same structure as grid1
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS grid2 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        v1 DECIMAL(10, 2) NOT NULL,
        v2 DECIMAL(10, 2) NOT NULL,
        v3 DECIMAL(10, 2) NOT NULL,
        v12 DECIMAL(10, 2) NOT NULL,
        v23 DECIMAL(10, 2) NOT NULL,
        v31 DECIMAL(10, 2) NOT NULL,
        a1 DECIMAL(10, 2) NOT NULL,
        a2 DECIMAL(10, 2) NOT NULL,
        a3 DECIMAL(10, 2) NOT NULL,
        kva1 DECIMAL(10, 2) NOT NULL,
        kva2 DECIMAL(10, 2) NOT NULL,
        kva3 DECIMAL(10, 2) NOT NULL,
        kvat DECIMAL(10, 2) NOT NULL,
        kvar1 DECIMAL(10, 2) NOT NULL,
        kvar2 DECIMAL(10, 2) NOT NULL,
        kvar3 DECIMAL(10, 2) NOT NULL,
        kvart DECIMAL(10, 2) NOT NULL,
        kw1 DECIMAL(10, 2) NOT NULL,
        kw2 DECIMAL(10, 2) NOT NULL,
        kw3 DECIMAL(10, 2) NOT NULL,
        kwt DECIMAL(10, 2) NOT NULL,
        pf1 DECIMAL(10, 2) NOT NULL,
        pf2 DECIMAL(10, 2) NOT NULL,
        pf3 DECIMAL(10, 2) NOT NULL,
        pft DECIMAL(10, 2) NOT NULL,
        hz DECIMAL(10, 2) NOT NULL,
        kwh_import DECIMAL(10, 2) NOT NULL,
        kwh_export DECIMAL(10, 2) NOT NULL,
        kvarh_import DECIMAL(10, 2) NOT NULL,
        kvarh_export DECIMAL(10, 2) NOT NULL,
        time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created grid2 table');
    
    // Create generator1 table - same structure as grid1
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS generator1 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        v1 DECIMAL(10, 2) NOT NULL,
        v2 DECIMAL(10, 2) NOT NULL,
        v3 DECIMAL(10, 2) NOT NULL,
        v12 DECIMAL(10, 2) NOT NULL,
        v23 DECIMAL(10, 2) NOT NULL,
        v31 DECIMAL(10, 2) NOT NULL,
        a1 DECIMAL(10, 2) NOT NULL,
        a2 DECIMAL(10, 2) NOT NULL,
        a3 DECIMAL(10, 2) NOT NULL,
        kva1 DECIMAL(10, 2) NOT NULL,
        kva2 DECIMAL(10, 2) NOT NULL,
        kva3 DECIMAL(10, 2) NOT NULL,
        kvat DECIMAL(10, 2) NOT NULL,
        kvar1 DECIMAL(10, 2) NOT NULL,
        kvar2 DECIMAL(10, 2) NOT NULL,
        kvar3 DECIMAL(10, 2) NOT NULL,
        kvart DECIMAL(10, 2) NOT NULL,
        kw1 DECIMAL(10, 2) NOT NULL,
        kw2 DECIMAL(10, 2) NOT NULL,
        kw3 DECIMAL(10, 2) NOT NULL,
        kwt DECIMAL(10, 2) NOT NULL,
        pf1 DECIMAL(10, 2) NOT NULL,
        pf2 DECIMAL(10, 2) NOT NULL,
        pf3 DECIMAL(10, 2) NOT NULL,
        pft DECIMAL(10, 2) NOT NULL,
        hz DECIMAL(10, 2) NOT NULL,
        kwh_import DECIMAL(10, 2) NOT NULL,
        kwh_export DECIMAL(10, 2) NOT NULL,
        kvarh_import DECIMAL(10, 2) NOT NULL,
        kvarh_export DECIMAL(10, 2) NOT NULL,
        time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created generator1 table');
    
    // Create generator2 table - same structure as grid1
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS generator2 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        v1 DECIMAL(10, 2) NOT NULL,
        v2 DECIMAL(10, 2) NOT NULL,
        v3 DECIMAL(10, 2) NOT NULL,
        v12 DECIMAL(10, 2) NOT NULL,
        v23 DECIMAL(10, 2) NOT NULL,
        v31 DECIMAL(10, 2) NOT NULL,
        a1 DECIMAL(10, 2) NOT NULL,
        a2 DECIMAL(10, 2) NOT NULL,
        a3 DECIMAL(10, 2) NOT NULL,
        kva1 DECIMAL(10, 2) NOT NULL,
        kva2 DECIMAL(10, 2) NOT NULL,
        kva3 DECIMAL(10, 2) NOT NULL,
        kvat DECIMAL(10, 2) NOT NULL,
        kvar1 DECIMAL(10, 2) NOT NULL,
        kvar2 DECIMAL(10, 2) NOT NULL,
        kvar3 DECIMAL(10, 2) NOT NULL,
        kvart DECIMAL(10, 2) NOT NULL,
        kw1 DECIMAL(10, 2) NOT NULL,
        kw2 DECIMAL(10, 2) NOT NULL,
        kw3 DECIMAL(10, 2) NOT NULL,
        kwt DECIMAL(10, 2) NOT NULL,
        pf1 DECIMAL(10, 2) NOT NULL,
        pf2 DECIMAL(10, 2) NOT NULL,
        pf3 DECIMAL(10, 2) NOT NULL,
        pft DECIMAL(10, 2) NOT NULL,
        hz DECIMAL(10, 2) NOT NULL,
        kwh_import DECIMAL(10, 2) NOT NULL,
        kwh_export DECIMAL(10, 2) NOT NULL,
        kvarh_import DECIMAL(10, 2) NOT NULL,
        kvarh_export DECIMAL(10, 2) NOT NULL,
        time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created generator2 table');
    
    // Create inverter1 table - same structure as grid1
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS inverter1 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        v1 DECIMAL(10, 2) NOT NULL,
        v2 DECIMAL(10, 2) NOT NULL,
        v3 DECIMAL(10, 2) NOT NULL,
        v12 DECIMAL(10, 2) NOT NULL,
        v23 DECIMAL(10, 2) NOT NULL,
        v31 DECIMAL(10, 2) NOT NULL,
        a1 DECIMAL(10, 2) NOT NULL,
        a2 DECIMAL(10, 2) NOT NULL,
        a3 DECIMAL(10, 2) NOT NULL,
        kva1 DECIMAL(10, 2) NOT NULL,
        kva2 DECIMAL(10, 2) NOT NULL,
        kva3 DECIMAL(10, 2) NOT NULL,
        kvat DECIMAL(10, 2) NOT NULL,
        kvar1 DECIMAL(10, 2) NOT NULL,
        kvar2 DECIMAL(10, 2) NOT NULL,
        kvar3 DECIMAL(10, 2) NOT NULL,
        kvart DECIMAL(10, 2) NOT NULL,
        kw1 DECIMAL(10, 2) NOT NULL,
        kw2 DECIMAL(10, 2) NOT NULL,
        kw3 DECIMAL(10, 2) NOT NULL,
        kwt DECIMAL(10, 2) NOT NULL,
        pf1 DECIMAL(10, 2) NOT NULL,
        pf2 DECIMAL(10, 2) NOT NULL,
        pf3 DECIMAL(10, 2) NOT NULL,
        pft DECIMAL(10, 2) NOT NULL,
        hz DECIMAL(10, 2) NOT NULL,
        kwh_import DECIMAL(10, 2) NOT NULL,
        kwh_export DECIMAL(10, 2) NOT NULL,
        kvarh_import DECIMAL(10, 2) NOT NULL,
        kvarh_export DECIMAL(10, 2) NOT NULL,
        time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created inverter1 table');
    
    // Create inverter2 table - same structure as grid1
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS inverter2 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        v1 DECIMAL(10, 2) NOT NULL,
        v2 DECIMAL(10, 2) NOT NULL,
        v3 DECIMAL(10, 2) NOT NULL,
        v12 DECIMAL(10, 2) NOT NULL,
        v23 DECIMAL(10, 2) NOT NULL,
        v31 DECIMAL(10, 2) NOT NULL,
        a1 DECIMAL(10, 2) NOT NULL,
        a2 DECIMAL(10, 2) NOT NULL,
        a3 DECIMAL(10, 2) NOT NULL,
        kva1 DECIMAL(10, 2) NOT NULL,
        kva2 DECIMAL(10, 2) NOT NULL,
        kva3 DECIMAL(10, 2) NOT NULL,
        kvat DECIMAL(10, 2) NOT NULL,
        kvar1 DECIMAL(10, 2) NOT NULL,
        kvar2 DECIMAL(10, 2) NOT NULL,
        kvar3 DECIMAL(10, 2) NOT NULL,
        kvart DECIMAL(10, 2) NOT NULL,
        kw1 DECIMAL(10, 2) NOT NULL,
        kw2 DECIMAL(10, 2) NOT NULL,
        kw3 DECIMAL(10, 2) NOT NULL,
        kwt DECIMAL(10, 2) NOT NULL,
        pf1 DECIMAL(10, 2) NOT NULL,
        pf2 DECIMAL(10, 2) NOT NULL,
        pf3 DECIMAL(10, 2) NOT NULL,
        pft DECIMAL(10, 2) NOT NULL,
        hz DECIMAL(10, 2) NOT NULL,
        kwh_import DECIMAL(10, 2) NOT NULL,
        kwh_export DECIMAL(10, 2) NOT NULL,
        kvarh_import DECIMAL(10, 2) NOT NULL,
        kvarh_export DECIMAL(10, 2) NOT NULL,
        time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created inverter2 table');
    
    // Create alerts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        status VARCHAR(50) NOT NULL,
        description VARCHAR(255) NOT NULL,
        component VARCHAR(100) NOT NULL,
        time VARCHAR(50) NOT NULL,
        timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created alerts table');
    
    // Create forecast_days table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS forecast_days (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date VARCHAR(50) NOT NULL,
        weather VARCHAR(50) NOT NULL,
        forecast VARCHAR(255) NOT NULL,
        comparison DECIMAL(10, 2) NOT NULL
      )
    `);
    console.log('Created forecast_days table');
    
    // Close the connection
    await connection.end();
    
    console.log('All tables created successfully');
    return true;
  } catch (error) {
    console.error('Error creating tables:', error);
    return false;
  }
}

// Seed the database with test data
async function seedDatabase() {
  try {
    console.log('Seeding database with test data...');
    
    // Create sample data
    const grid1Data = generatePowerData(0.01, 0.1);
    const grid2Data = generatePowerData(0.015, 0.12);
    const generator1Data = generatePowerData(0.2, 0.3);
    const generator2Data = generatePowerData(0.18, 0.25);
    const inverter1Data = generatePowerData(0.3, 0.4);
    const inverter2Data = generatePowerData(0.28, 0.38);
    
    // Insert data for each table
    console.log('Inserting data for grid1...');
    await db.insert(schema.grid1).values(grid1Data);
    
    console.log('Inserting data for grid2...');
    await db.insert(schema.grid2).values(grid2Data);
    
    console.log('Inserting data for generator1...');
    await db.insert(schema.generator1).values(generator1Data);
    
    console.log('Inserting data for generator2...');
    await db.insert(schema.generator2).values(generator2Data);
    
    console.log('Inserting data for inverter1...');
    await db.insert(schema.inverter1).values(inverter1Data);
    
    console.log('Inserting data for inverter2...');
    await db.insert(schema.inverter2).values(inverter2Data);
    
    // Insert alerts
    console.log('Inserting alerts...');
    const alerts = [
      {
        status: 'Warning',
        description: 'Solar panel efficiency below threshold',
        component: 'Inverter 1',
        time: '2 hours ago'
      },
      {
        status: 'Critical',
        description: 'Generator overheating',
        component: 'Generator 2',
        time: '45 minutes ago'
      },
      {
        status: 'Info',
        description: 'Grid power fluctuation detected',
        component: 'Grid 1',
        time: '3 hours ago'
      },
      {
        status: 'Warning',
        description: 'Battery charge low',
        component: 'Battery Bank',
        time: '30 minutes ago'
      },
      {
        status: 'Resolved',
        description: 'System maintenance completed',
        component: 'System',
        time: '1 hour ago'
      }
    ];
    await db.insert(schema.alerts).values(alerts);
    
    // Insert forecast days
    console.log('Inserting forecast days...');
    const forecastDays = [
      {
        date: 'Today',
        weather: 'Sunny',
        forecast: 'Excellent generation conditions',
        comparison: 10.5
      },
      {
        date: 'Tomorrow',
        weather: 'Partly Cloudy',
        forecast: 'Good generation expected',
        comparison: 5.2
      },
      {
        date: 'Wednesday',
        weather: 'Overcast',
        forecast: 'Limited solar generation',
        comparison: -8.3
      },
      {
        date: 'Thursday',
        weather: 'Sunny',
        forecast: 'High generation potential',
        comparison: 12.7
      },
      {
        date: 'Friday',
        weather: 'Rain',
        forecast: 'Poor solar conditions',
        comparison: -15.4
      }
    ];
    await db.insert(schema.forecastDays).values(forecastDays);
    
    console.log('Database seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

// Helper function to generate power data
function generatePowerData(baseValue: number, variance: number): any[] {
  const data = [];
  const now = new Date();
  
  // Generate data for the last 24 hours
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() - (i * 60 * 60 * 1000)); // hourly data points
    
    const randomFactor = () => baseValue + (Math.random() * variance);
    const randomPower = () => baseValue * 10 + (Math.random() * variance * 10);
    
    data.push({
      v1: randomFactor() * 100,
      v2: randomFactor() * 100,
      v3: randomFactor() * 100,
      v12: randomFactor() * 200,
      v23: randomFactor() * 200,
      v31: randomFactor() * 200,
      a1: randomFactor() * 2,
      a2: randomFactor() * 2,
      a3: randomFactor() * 2,
      kva1: randomPower(),
      kva2: randomPower(),
      kva3: randomPower(),
      kvat: randomPower() * 3,
      kvar1: randomPower() * 0.3,
      kvar2: randomPower() * 0.3,
      kvar3: randomPower() * 0.3,
      kvart: randomPower() * 0.3 * 3,
      kw1: randomPower(),
      kw2: randomPower(),
      kw3: randomPower(),
      kwt: randomPower() * 3,
      pf1: 0.8 + (Math.random() * 0.2),
      pf2: 0.8 + (Math.random() * 0.2),
      pf3: 0.8 + (Math.random() * 0.2),
      pft: 0.8 + (Math.random() * 0.2),
      hz: 49.8 + (Math.random() * 0.4),
      kwh_import: randomPower() * 24,
      kwh_export: randomPower() * 8,
      kvarh_import: randomPower() * 12,
      kvarh_export: randomPower() * 4,
      time: time
    });
  }
  
  return data;
}

// Run the setup
async function main() {
  console.log('Starting MySQL database setup...');
  
  // First create tables
  const tablesCreated = await createTables();
  if (!tablesCreated) {
    console.error('Failed to create tables. Exiting...');
    process.exit(1);
  }
  
  // Then seed the database
  const databaseSeeded = await seedDatabase();
  if (!databaseSeeded) {
    console.error('Failed to seed database. Exiting...');
    process.exit(1);
  }
  
  console.log('MySQL database setup completed successfully');
  process.exit(0);
}

main();