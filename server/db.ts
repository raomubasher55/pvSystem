import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";

// MySQL connection configuration
const connection = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12772195',
  password: 'RCzvNTxRsL',
  database: 'sql12772195',
  port: 3306,
  connectionLimit: 10
});

// Create drizzle database instance
export const db = drizzle(connection, { schema, mode: 'default' });