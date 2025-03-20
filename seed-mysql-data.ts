// Script to seed MySQL database with test data

import mysql from 'mysql2/promise';

// Helper function to generate power data
function generatePowerData(baseValue: number, variance: number, count: number = 24): any[] {
  const data = [];
  const now = new Date();
  
  // Generate data points
  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - (i * 60 * 60 * 1000)); // hourly data points
    
    const randomFactor = () => baseValue + (Math.random() * variance);
    const randomPower = () => baseValue * 10 + (Math.random() * variance * 10);
    
    data.push([
      randomFactor() * 100, // v1
      randomFactor() * 100, // v2
      randomFactor() * 100, // v3
      randomFactor() * 200, // v12
      randomFactor() * 200, // v23
      randomFactor() * 200, // v31
      randomFactor() * 2,   // a1
      randomFactor() * 2,   // a2
      randomFactor() * 2,   // a3
      randomPower(),        // kva1
      randomPower(),        // kva2
      randomPower(),        // kva3
      randomPower() * 3,    // kvat
      randomPower() * 0.3,  // kvar1
      randomPower() * 0.3,  // kvar2
      randomPower() * 0.3,  // kvar3
      randomPower() * 0.3 * 3, // kvart
      randomPower(),        // kw1
      randomPower(),        // kw2
      randomPower(),        // kw3
      randomPower() * 3,    // kwt
      0.8 + (Math.random() * 0.2), // pf1
      0.8 + (Math.random() * 0.2), // pf2
      0.8 + (Math.random() * 0.2), // pf3
      0.8 + (Math.random() * 0.2), // pft
      49.8 + (Math.random() * 0.4), // hz
      randomPower() * 24,   // kwh_import
      randomPower() * 8,    // kwh_export
      randomPower() * 12,   // kvarh_import
      randomPower() * 4,    // kvarh_export
      time.toISOString().slice(0, 19).replace('T', ' ') // time in MySQL datetime format
    ]);
  }
  
  return data;
}

async function seedDatabase() {
  console.log('Starting to seed MySQL database...');
  
  try {
    // Create a connection
    const connection = await mysql.createConnection({
      host: 'sql12.freesqldatabase.com',
      user: 'sql12768689',
      password: 'mUu4y7Yfk8',
      database: 'sql12768689',
      port: 3306
    });
    
    console.log('Connected to MySQL database');
    
    // Generate test data for power sources
    const sources = [
      { name: 'grid1', baseValue: 0.01, variance: 0.1 },
      { name: 'grid2', baseValue: 0.015, variance: 0.12 },
      { name: 'generator1', baseValue: 0.2, variance: 0.3 },
      { name: 'generator2', baseValue: 0.18, variance: 0.25 },
      { name: 'inverter1', baseValue: 0.3, variance: 0.4 },
      { name: 'inverter2', baseValue: 0.28, variance: 0.38 }
    ];
    
    // Insert data for each power source
    for (const source of sources) {
      console.log(`Generating data for ${source.name}...`);
      const data = generatePowerData(source.baseValue, source.variance, 10); // Reduced to 10 records to avoid timeouts
      
      console.log(`Inserting data for ${source.name}...`);
      for (const record of data) {
        await connection.execute(`
          INSERT INTO ${source.name} (
            v1, v2, v3, v12, v23, v31, 
            a1, a2, a3, 
            kva1, kva2, kva3, kvat, 
            kvar1, kvar2, kvar3, kvart,
            kw1, kw2, kw3, kwt,
            pf1, pf2, pf3, pft,
            hz, 
            kwh_import, kwh_export, 
            kvarh_import, kvarh_export,
            time
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, record);
      }
      console.log(`Inserted data for ${source.name}`);
    }
    
    // Insert alerts
    console.log('Inserting alerts...');
    const alerts = [
      ['Warning', 'Solar panel efficiency below threshold', 'Inverter 1', '2 hours ago', new Date().toISOString().slice(0, 19).replace('T', ' ')],
      ['Critical', 'Generator overheating', 'Generator 2', '45 minutes ago', new Date().toISOString().slice(0, 19).replace('T', ' ')],
      ['Info', 'Grid power fluctuation detected', 'Grid 1', '3 hours ago', new Date().toISOString().slice(0, 19).replace('T', ' ')],
      ['Warning', 'Battery charge low', 'Battery Bank', '30 minutes ago', new Date().toISOString().slice(0, 19).replace('T', ' ')],
      ['Resolved', 'System maintenance completed', 'System', '1 hour ago', new Date().toISOString().slice(0, 19).replace('T', ' ')]
    ];
    
    for (const alert of alerts) {
      await connection.execute(`
        INSERT INTO alerts (status, description, component, time, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `, alert);
    }
    console.log('Inserted alerts');
    
    // Insert forecast days
    console.log('Inserting forecast days...');
    const forecastDays = [
      ['Today', 'Sunny', 'Excellent generation conditions', 10.5],
      ['Tomorrow', 'Partly Cloudy', 'Good generation expected', 5.2],
      ['Wednesday', 'Overcast', 'Limited solar generation', -8.3],
      ['Thursday', 'Sunny', 'High generation potential', 12.7],
      ['Friday', 'Rain', 'Poor solar conditions', -15.4]
    ];
    
    for (const forecast of forecastDays) {
      await connection.execute(`
        INSERT INTO forecast_days (date, weather, forecast, comparison)
        VALUES (?, ?, ?, ?)
      `, forecast);
    }
    console.log('Inserted forecast days');
    
    // Close the connection
    await connection.end();
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();