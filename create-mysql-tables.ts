// Script to create MySQL tables

import mysql from 'mysql2/promise';

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
    
    // Create tables for power sources
    for (const table of ['grid1', 'grid2', 'generator1', 'generator2', 'inverter1', 'inverter2']) {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS ${table} (
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
      console.log(`Created ${table} table`);
    }
    
    // Create alerts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        status VARCHAR(50) NOT NULL,
        description VARCHAR(255) NOT NULL,
        component VARCHAR(100) NOT NULL,
        time VARCHAR(50) NOT NULL,
        timestamp DATETIME NOT NULL
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
    
    // Final success message
    console.log('MySQL database tables created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

// Run the setup
createTables();