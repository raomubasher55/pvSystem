// Minimal script to seed just enough data to make the app work

import mysql from 'mysql2/promise';

// Helper function to generate power time series data
function generatePowerTimeSeriesData(count: number, baseValue: number, variance: number) {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
    const randomValue = () => baseValue + (Math.random() * variance);
    
    data.push([
      randomValue() * 100, // v1
      randomValue() * 100, // v2
      randomValue() * 100, // v3
      randomValue() * 200, // v12
      randomValue() * 200, // v23
      randomValue() * 200, // v31
      randomValue() * 2,   // a1
      randomValue() * 2,   // a2
      randomValue() * 2,   // a3
      randomValue() * 10,  // kva1
      randomValue() * 10,  // kva2
      randomValue() * 10,  // kva3
      randomValue() * 30,  // kvat
      randomValue() * 3,   // kvar1
      randomValue() * 3,   // kvar2
      randomValue() * 3,   // kvar3
      randomValue() * 9,   // kvart
      randomValue() * 10,  // kw1
      randomValue() * 10,  // kw2
      randomValue() * 10,  // kw3
      randomValue() * 30,  // kwt
      0.9,                 // pf1
      0.9,                 // pf2
      0.9,                 // pf3
      0.9,                 // pft
      50.0,                // hz
      randomValue() * 100, // kwh_import
      randomValue() * 50,  // kwh_export
      randomValue() * 20,  // kvarh_import
      randomValue() * 10,  // kvarh_export
      time.toISOString().slice(0, 19).replace('T', ' ') // time
    ]);
  }
  
  return data;
}

async function seedDatabase() {
  try {
    console.log('Seeding MySQL database with minimal data...');
    const connection = await mysql.createConnection({
      host: 'sql12.freesqldatabase.com',
      user: 'sql12768689',
      password: 'mUu4y7Yfk8',
      database: 'sql12768689',
      port: 3306
    });
    
    // Just seed one record for each power source
    const sources = ['grid1', 'grid2', 'generator1', 'generator2', 'inverter1', 'inverter2'];
    
    for (const source of sources) {
      console.log(`Seeding ${source}...`);
      // Generate just 2 records per source to keep it minimal
      const data = generatePowerTimeSeriesData(2, 0.5, 0.2);
      
      for (const record of data) {
        await connection.execute(`
          INSERT INTO ${source} (
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
    }
    
    // Insert one alert
    console.log('Seeding alerts...');
    await connection.execute(`
      INSERT INTO alerts (status, description, component, time, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `, ['Warning', 'Battery charge low', 'Battery Bank', '30 minutes ago', new Date().toISOString().slice(0, 19).replace('T', ' ')]);
    
    // Insert one forecast day
    console.log('Seeding forecast days...');
    await connection.execute(`
      INSERT INTO forecast_days (date, weather, forecast, comparison)
      VALUES (?, ?, ?, ?)
    `, ['Today', 'Sunny', 'Excellent generation conditions', 10.5]);
    
    await connection.end();
    console.log('Minimal seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();