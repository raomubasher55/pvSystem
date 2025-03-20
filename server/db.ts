import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config()

// Create the MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Interfaces remain the same
interface PowerData {
  source_type: string;
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

// Get latest power data for a specific source
export async function getLatestPowerData(source: string): Promise<PowerData> {
  const [rows] = await pool.query(
    `SELECT 
      source_type, v1, v2, v3, v12, v23, v31,
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
    throw new Error(`No power data available for source: ${source}`);
  }
  return (rows as any[])[0] as PowerData;
}

// Get latest power data for all sources
export async function getAllSourcesLatestData(): Promise<PowerData[]> {
  const [rows] = await pool.query(
    `SELECT 
      source_type, v1, v2, v3, v12, v23, v31,
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
    WHERE source_type IN ('grid', 'generator', 'inverter')
    AND time = (
      SELECT MAX(time) 
      FROM power_source_data ps2 
      WHERE ps2.source_type = power_source_data.source_type
    )`
  );

  return rows as PowerData[];
}

// Get historical power data for a specific source
export async function getHistoricalPowerData(source: string, hours: number = 24): Promise<PowerHistoryRecord[]> {
  const [rows] = await pool.query(
    `SELECT 
      kwt as total_power,
      kwh_import,
      kwh_export,
      time
    FROM power_source_data 
    WHERE source_type = ?
    AND time >= NOW() - INTERVAL ? HOUR
    ORDER BY time ASC`,
    [source, hours]
  );
  return rows as PowerHistoryRecord[];
}

// Get power distribution across all sources
export async function getPowerSourceDistribution(): Promise<{ name: string; value: number }[]> {
  const [rows] = await pool.query(
    `SELECT 
      source_type,
      SUM(kwh_import) as total_import,
      SUM(kwh_export) as total_export,
      SUM(kwt) as total_power
    FROM power_source_data 
    WHERE time >= NOW() - INTERVAL '24' HOUR
    GROUP BY source_type`
  );

  const results = rows as Array<{
    source_type: string;
    total_import: number;
    total_export: number;
    total_power: number;
  }>;

  return results.map(row => ({
    name: row.source_type.charAt(0).toUpperCase() + row.source_type.slice(1),
    value: row.total_power || 0
  }));
}


// Get voltage data
export async function getVoltageData(source?: string): Promise<VoltageRecord[]> {
  const query = source 
    ? `SELECT v1, v2, v3, time 
       FROM power_source_data 
       WHERE source_type = ? 
       AND time >= NOW() - INTERVAL '1' HOUR
       ORDER BY time ASC`
    : `SELECT v1, v2, v3, time 
       FROM power_source_data 
       WHERE time >= NOW() - INTERVAL '1' HOUR
       ORDER BY time ASC`;

  const params = source ? [source] : [];
  const [rows] = await pool.query(query, params);
  return rows as VoltageRecord[];
}

// Get current data
export async function getCurrentData(source?: string): Promise<CurrentRecord[]> {
  const query = source 
    ? `SELECT a1, a2, a3, time 
       FROM power_source_data 
       WHERE source_type = ? 
       AND time >= NOW() - INTERVAL '1' HOUR
       ORDER BY time ASC`
    : `SELECT a1, a2, a3, time 
       FROM power_source_data 
       WHERE time >= NOW() - INTERVAL '1' HOUR
       ORDER BY time ASC`;

  const params = source ? [source] : [];
  const [rows] = await pool.query(query, params);
  return rows as CurrentRecord[];
}

// Get power factor data
export async function getPowerFactorData(source?: string): Promise<PowerFactorRecord[]> {
  const query = source 
    ? `SELECT pf1, pf2, pf3, pft, time 
       FROM power_source_data 
       WHERE source_type = ? 
       AND time >= NOW() - INTERVAL '1' HOUR
       ORDER BY time ASC`
    : `SELECT pf1, pf2, pf3, pft, time 
       FROM power_source_data 
       WHERE time >= NOW() - INTERVAL '1' HOUR
       ORDER BY time ASC`;

  const params = source ? [source] : [];
  const [rows] = await pool.query(query, params);
  return rows as PowerFactorRecord[];
}

// Get frequency data
export async function getFrequencyData(source?: string): Promise<FrequencyRecord[]> {
  const query = source 
    ? `SELECT hz, time 
       FROM power_source_data 
       WHERE source_type = ? 
       AND time >= NOW() - INTERVAL '1' HOUR
       ORDER BY time ASC`
    : `SELECT hz, time 
       FROM power_source_data 
       WHERE time >= NOW() - INTERVAL '1' HOUR
       ORDER BY time ASC`;

  const params = source ? [source] : [];
  const [rows] = await pool.query(query, params);
  return rows as FrequencyRecord[];
}