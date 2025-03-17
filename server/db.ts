import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

interface PowerData extends RowDataPacket {
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

// Create connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to get latest power data
export async function getLatestPowerData(): Promise<PowerData> {
  const [rows] = await pool.execute<PowerData[]>(
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
    FROM power_data 
    ORDER BY time DESC 
    LIMIT 1`
  );
  if (!rows || rows.length === 0) {
    throw new Error('No power data available');
  }
  return rows[0];
}

interface PowerHistoryRecord extends RowDataPacket {
  total_power: number;
  kwh_import: number;
  kwh_export: number;
  time: Date;
}

interface PowerDistributionRecord extends RowDataPacket {
  grid_import: number;
  grid_export: number;
  total_generation: number;
}

interface VoltageRecord extends RowDataPacket {
  v1: number;
  v2: number;
  v3: number;
  time: Date;
}

interface CurrentRecord extends RowDataPacket {
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

// Get historical power data
export async function getHistoricalPowerData(hours: number = 24): Promise<PowerHistoryRecord[]> {
  const [rows] = await pool.execute<PowerHistoryRecord[]>(
    `SELECT 
      kwt as total_power,
      kwh_import,
      kwh_export,
      time
    FROM power_data 
    WHERE time >= DATE_SUB(NOW(), INTERVAL ? HOUR)
    ORDER BY time ASC`,
    [hours]
  );
  return rows || [];
}

// Get power source distribution
export async function getPowerSourceDistribution(): Promise<{ name: string; value: number }[]> {
  const [rows] = await pool.execute<PowerDistributionRecord[]>(
    `SELECT 
      SUM(kwh_import) as grid_import,
      SUM(kwh_export) as grid_export,
      SUM(kwt) as total_generation
    FROM power_data 
    WHERE time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`
  );
  
  const data = rows[0] || { grid_import: 0, grid_export: 0, total_generation: 0 };
  return [
    { name: 'Grid Import', value: data.grid_import || 0 },
    { name: 'Solar/Inverter', value: data.total_generation || 0 },
    { name: 'Grid Export', value: data.grid_export || 0 }
  ];
}

// Get voltage data
export async function getVoltageData(): Promise<VoltageRecord[]> {
  const [rows] = await pool.execute<VoltageRecord[]>(
    `SELECT v1, v2, v3, time 
    FROM power_data 
    WHERE time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
    ORDER BY time ASC`
  );
  return rows || [];
}

// Get current data
export async function getCurrentData(): Promise<CurrentRecord[]> {
  const [rows] = await pool.execute<CurrentRecord[]>(
    `SELECT a1, a2, a3, time 
    FROM power_data 
    WHERE time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
    ORDER BY time ASC`
  );
  return rows || [];
}

// Get power factor data
export async function getPowerFactorData(): Promise<PowerFactorRecord[]> {
  const [rows] = await pool.execute<PowerFactorRecord[]>(
    `SELECT pf1, pf2, pf3, pft, time 
    FROM power_data 
    WHERE time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
    ORDER BY time ASC`
  );
  return rows || [];
}

// Get frequency data
export async function getFrequencyData(): Promise<FrequencyRecord[]> {
  const [rows] = await pool.execute<FrequencyRecord[]>(
    `SELECT hz, time 
    FROM power_data 
    WHERE time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
    ORDER BY time ASC`
  );
  return rows || [];
}

export default pool;