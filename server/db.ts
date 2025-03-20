import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config()



// Create the MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Hostname (e.g., 127.0.0.1)
  user: process.env.DB_USER, // Username (e.g., root)
  password: process.env.DB_PASSWORD, // Password (e.g., admin)
  database: process.env.DB_NAME, // Database name (e.g., grafana)
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306, // Default MySQL port 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


// Interfaces remain the same
interface PowerData {
  v1: number;
  v2: number;
  v3: number;
  v12: number;
  v23: number;
  v31: number;
  a1: number;
  a2: number;
  a3: number;
  kva1: number;
  kva2: number;
  kva3: number;
  kvat: number;
  kvar1: number;
  kvar2: number;
  kvar3: number;
  kvart: number;
  kw1: number;
  kw2: number;
  kw3: number;
  kwt: number;
  pf1: number;
  pf2: number;
  pf3: number;
  pft: number;
  hz: number;
  kwh_import: number;
  kwh_export: number;
  kvarh_import: number;
  kvarh_export: number;
  time: Date;
}
interface PowerHistoryRecord {
  total_power: number;
  kwh_import: number;
  kwh_export: number;
  time: Date;
}

interface PowerDistributionRecord {
  grid_import: number;
  grid_export: number;
  total_generation: number;
}

interface VoltageRecord {
  v1: number;
  v2: number;
  v3: number;
  time: Date;
}

interface CurrentRecord {
  a1: number;
  a2: number;
  a3: number;
  time: Date;
}

interface PowerFactorRecord {
  pf1: number;
  pf2: number;
  pf3: number;
  pft: number;
  time: Date;
}

interface FrequencyRecord {
  hz: number;
  time: Date;
}

export async function getLatestPowerData(source: string): Promise<PowerData> {
  const [rows] = await pool.query(
    `SELECT 
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
    FROM power_source_data 
    WHERE source_type = ?
    ORDER BY time DESC 
    LIMIT 1`,
    [source]
  );
  
  if (!rows || (rows as any[]).length === 0) {
    throw new Error('No power data available');
  }
  return (rows as any[])[0] as PowerData;
}

// Get historical power data
export async function getHistoricalPowerData(hours: number = 24): Promise<PowerHistoryRecord[]> {
  const [rows] = await pool.query(
    `SELECT 
      kwt as total_power,
      kwh_import,
      kwh_export,
      time
    FROM china_3qey 
    WHERE time >= NOW() - INTERVAL ? HOUR
    ORDER BY time ASC`,
    [hours]
  );
  return rows as PowerHistoryRecord[];
}

// Get power source distribution
export async function getPowerSourceDistribution(): Promise<{ name: string; value: number }[]> {
  const [rows] = await pool.query(
    `SELECT 
      SUM(kwh_import) as grid_import,
      SUM(kwh_export) as grid_export,
      SUM(kwt) as total_generation
    FROM china_3qey 
    WHERE time >= NOW() - INTERVAL '24' HOUR`
  );
  
  const data = (rows as any[])[0] || { grid_import: 0, grid_export: 0, total_generation: 0 };
  return [
    { name: 'Grid Import', value: data.grid_import || 0 },
    { name: 'Solar/Inverter', value: data.total_generation || 0 },
    { name: 'Grid Export', value: data.grid_export || 0 }
  ];
}

// Get voltage data
export async function getVoltageData(): Promise<VoltageRecord[]> {
  const [rows] = await pool.query(
    `SELECT v1, v2, v3, time 
    FROM china_3qey 
    WHERE time >= NOW() - INTERVAL '1' HOUR
    ORDER BY time ASC`
  );
  return rows as VoltageRecord[];
}

// Get current data
export async function getCurrentData(): Promise<CurrentRecord[]> {
  const [rows] = await pool.query(
    `SELECT a1, a2, a3, time 
    FROM china_3qey 
    WHERE time >= NOW() - INTERVAL '1' HOUR
    ORDER BY time ASC`
  );
  return rows as CurrentRecord[];
}

// Get power factor data
export async function getPowerFactorData(): Promise<PowerFactorRecord[]> {
  const [rows] = await pool.query(
    `SELECT pf1, pf2, pf3, pft, time 
    FROM china_3qey 
    WHERE time >= NOW() - INTERVAL '1' HOUR
    ORDER BY time ASC`
  );
  return rows as PowerFactorRecord[];
}

// Get frequency data
export async function getFrequencyData(): Promise<FrequencyRecord[]> {
  const [rows] = await pool.query(
    `SELECT hz, time 
    FROM china_3qey 
    WHERE time >= NOW() - INTERVAL '1' HOUR
    ORDER BY time ASC`
  );
  return rows as FrequencyRecord[];
}