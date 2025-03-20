import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

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

export async function getLatestPowerData(source: string): Promise<PowerData> {
  let tableName;
  if (source.startsWith('grid')) {
    tableName = source === 'grid1' ? 'grid1' : 'grid2';
  } else if (source.startsWith('generator')) {
    tableName = source === 'generator1' ? 'generator1' : 'generator2';
  } else if (source.startsWith('inverter')) {
    tableName = source === 'inverter1' ? 'inverter1' : 'inverter2';
  } else {
    throw new Error(`Invalid source type: ${source}`);
  }

  const [rows] = await pool.query(
    `SELECT *, '${source}' as source_type
     FROM ${tableName}
     ORDER BY time DESC 
     LIMIT 1`
  );

  if (!rows || (rows as any[]).length === 0) {
    throw new Error(`No power data available for source: ${source}`);
  }
  return { ...(rows as any[])[0], source_type: source };
}

export async function getAllSourcesLatestData(): Promise<PowerData[]> {
  const [rows] = await pool.query(`
    (SELECT *, 'grid1' as source_type FROM grid1 ORDER BY time DESC LIMIT 1)
    UNION ALL
    (SELECT *, 'generator1' as source_type FROM generator1 ORDER BY time DESC LIMIT 1)
    UNION ALL
    (SELECT *, 'inverter1' as source_type FROM inverter1 ORDER BY time DESC LIMIT 1)
    ORDER BY time DESC
  `);

  return rows as PowerData[];
}

export async function getHistoricalPowerData(source: string, hours: number = 24): Promise<PowerHistoryRecord[]> {
  let tableName;
  if (source.startsWith('grid')) {
    tableName = source === 'grid1' ? 'grid1' : 'grid2';
  } else if (source.startsWith('generator')) {
    tableName = source === 'generator1' ? 'generator1' : 'generator2';
  } else if (source.startsWith('inverter')) {
    tableName = source === 'inverter1' ? 'inverter1' : 'inverter2';
  } else {
    throw new Error(`Invalid source type: ${source}`);
  }

  const [rows] = await pool.query(
    `SELECT 
      kwt as total_power,
      kwh_import,
      kwh_export,
      time
    FROM ${tableName}
    WHERE time >= NOW() - INTERVAL '${hours} HOURS'
    ORDER BY time ASC`
  );
  return rows as PowerHistoryRecord[];
}

export async function getPowerSourceDistribution(): Promise<{ name: string; value: number }[]> {
  const [rows] = await pool.query(`
    SELECT 
      source_name,
      SUM(kwt) as total_power
    FROM (
      SELECT 'Grid 1' as source_name, kwt FROM grid1 WHERE time >= NOW() - INTERVAL '24 HOUR'
      UNION ALL
      SELECT 'Generator 1' as source_name, kwt FROM generator1 WHERE time >= NOW() - INTERVAL '24 HOUR'
      UNION ALL
      SELECT 'Inverter 1' as source_name, kwt FROM inverter1 WHERE time >= NOW() - INTERVAL '24 HOUR'
    ) AS combined
    GROUP BY source_name
  `);

  const results = rows as Array<{
    source_name: string;
    total_power: number;
  }>;

  return results.map(row => ({
    name: row.source_name,
    value: Number(row.total_power) || 0
  }));
}

export async function getVoltageData(source?: string): Promise<VoltageRecord[]> {
  let query;
  if (source) {
    const tableName = source.includes('1') ? `${source.split('1')[0]}1` : `${source.split('2')[0]}2`;
    query = `SELECT v1, v2, v3, time FROM ${tableName} WHERE time >= NOW() - INTERVAL '1 HOUR' ORDER BY time ASC`;
  } else {
    query = `
      SELECT v1, v2, v3, time FROM grid1 
      WHERE time >= NOW() - INTERVAL '1 HOUR'
      UNION ALL
      SELECT v1, v2, v3, time FROM generator1 
      WHERE time >= NOW() - INTERVAL '1 HOUR'
      UNION ALL
      SELECT v1, v2, v3, time FROM inverter1 
      WHERE time >= NOW() - INTERVAL '1 HOUR'
      ORDER BY time ASC
    `;
  }

  const [rows] = await pool.query(query);
  return rows as VoltageRecord[];
}

export async function getCurrentData(source?: string): Promise<CurrentRecord[]> {
  let query;
  if (source) {
    const tableName = source.includes('1') ? `${source.split('1')[0]}1` : `${source.split('2')[0]}2`;
    query = `SELECT a1, a2, a3, time FROM ${tableName} WHERE time >= NOW() - INTERVAL '1 HOUR' ORDER BY time ASC`;
  } else {
    query = `
      SELECT a1, a2, a3, time FROM grid1 
      WHERE time >= NOW() - INTERVAL '1 HOUR'
      UNION ALL
      SELECT a1, a2, a3, time FROM generator1 
      WHERE time >= NOW() - INTERVAL '1 HOUR'
      UNION ALL
      SELECT a1, a2, a3, time FROM inverter1 
      WHERE time >= NOW() - INTERVAL '1 HOUR'
      ORDER BY time ASC
    `;
  }

  const [rows] = await pool.query(query);
  return rows as CurrentRecord[];
}

export async function getPowerFactorData(source?: string): Promise<PowerFactorRecord[]> {
  let query;
  if (source) {
    const tableName = source.includes('1') ? `${source.split('1')[0]}1` : `${source.split('2')[0]}2`;
    query = `SELECT pf1, pf2, pf3, pft, time FROM ${tableName} WHERE time >= NOW() - INTERVAL '1 HOUR' ORDER BY time ASC`;
  } else {
    query = `
      SELECT pf1, pf2, pf3, pft, time FROM grid1 
      WHERE time >= NOW() - INTERVAL '1 HOUR'
      UNION ALL
      SELECT pf1, pf2, pf3, pft, time FROM generator1 
      WHERE time >= NOW() - INTERVAL '1 HOUR'
      UNION ALL
      SELECT pf1, pf2, pf3, pft, time FROM inverter1 
      WHERE time >= NOW() - INTERVAL '1 HOUR'
      ORDER BY time ASC
    `;
  }

  const [rows] = await pool.query(query);
  return rows as PowerFactorRecord[];
}

export async function getFrequencyData(source?: string): Promise<FrequencyRecord[]> {
  let query;
  if (source) {
    const tableName = source.includes('1') ? `${source.split('1')[0]}1` : `${source.split('2')[0]}2`;
    query = `SELECT hz, time FROM ${tableName} WHERE time >= NOW() - INTERVAL '1 HOUR' ORDER BY time ASC`;
  } else {
    query = `
      SELECT hz, time FROM grid1 
      WHERE time >= NOW() - INTERVAL '1 HOUR'
      UNION ALL
      SELECT hz, time FROM generator1 
      WHERE time >= NOW() - INTERVAL '1 HOUR'
      UNION ALL
      SELECT hz, time FROM inverter1 
      WHERE time >= NOW() - INTERVAL '1 HOUR'
      ORDER BY time ASC
    `;
  }

  const [rows] = await pool.query(query);
  return rows as FrequencyRecord[];
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