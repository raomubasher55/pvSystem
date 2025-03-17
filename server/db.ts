import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

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

// Helper function to get latest power data
export async function getLatestPowerData(): Promise<PowerData> {
  const result = await sql`
    SELECT 
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
    LIMIT 1
  `;
  
  if (!result || result.length === 0) {
    throw new Error('No power data available');
  }
  return result[0] as PowerData;
}

// Get historical power data
export async function getHistoricalPowerData(hours: number = 24): Promise<PowerHistoryRecord[]> {
  const result = await sql`
    SELECT 
      kwt as total_power,
      kwh_import,
      kwh_export,
      time
    FROM power_data 
    WHERE time >= NOW() - INTERVAL '${hours} hours'
    ORDER BY time ASC
  `;
  return result as PowerHistoryRecord[];
}

// Get power source distribution
export async function getPowerSourceDistribution(): Promise<{ name: string; value: number }[]> {
  const result = await sql`
    SELECT 
      SUM(kwh_import) as grid_import,
      SUM(kwh_export) as grid_export,
      SUM(kwt) as total_generation
    FROM power_data 
    WHERE time >= NOW() - INTERVAL '24 hours'
  `;
  
  const data = result[0] || { grid_import: 0, grid_export: 0, total_generation: 0 };
  return [
    { name: 'Grid Import', value: data.grid_import || 0 },
    { name: 'Solar/Inverter', value: data.total_generation || 0 },
    { name: 'Grid Export', value: data.grid_export || 0 }
  ];
}

// Get voltage data
export async function getVoltageData(): Promise<VoltageRecord[]> {
  const result = await sql`
    SELECT v1, v2, v3, time 
    FROM power_data 
    WHERE time >= NOW() - INTERVAL '1 hour'
    ORDER BY time ASC
  `;
  return result as VoltageRecord[];
}

// Get current data
export async function getCurrentData(): Promise<CurrentRecord[]> {
  const result = await sql`
    SELECT a1, a2, a3, time 
    FROM power_data 
    WHERE time >= NOW() - INTERVAL '1 hour'
    ORDER BY time ASC
  `;
  return result as CurrentRecord[];
}

// Get power factor data
export async function getPowerFactorData(): Promise<PowerFactorRecord[]> {
  const result = await sql`
    SELECT pf1, pf2, pf3, pft, time 
    FROM power_data 
    WHERE time >= NOW() - INTERVAL '1 hour'
    ORDER BY time ASC
  `;
  return result as PowerFactorRecord[];
}

// Get frequency data
export async function getFrequencyData(): Promise<FrequencyRecord[]> {
  const result = await sql`
    SELECT hz, time 
    FROM power_data 
    WHERE time >= NOW() - INTERVAL '1 hour'
    ORDER BY time ASC
  `;
  return result as FrequencyRecord[];
}