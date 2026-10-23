import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as dotenv from 'dotenv';
import * as schema from './schema/index';

dotenv.config();

const { Pool } = pg;

export interface DatabaseConfig {
  connectionString?: string;
  maxConnections?: number;
}

let poolInstance: pg.Pool | null = null;
let dbInstance: NodePgDatabase<typeof schema> | null = null;

export function getPgPool(config?: DatabaseConfig): pg.Pool {
  if (!poolInstance) {
    const connectionString =
      config?.connectionString ||
      process.env.DATABASE_URL ||
      'postgresql://simukti_user:simukti_password_2026@localhost:5432/simukti_db';

    poolInstance = new Pool({
      connectionString,
      max: config?.maxConnections || 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    poolInstance.on('error', (err) => {
      console.error('[SI-MUKTI DB] Unexpected pool error on idle client:', err);
    });
  }

  return poolInstance;
}

export function getDb(config?: DatabaseConfig): NodePgDatabase<typeof schema> {
  if (!dbInstance) {
    const pool = getPgPool(config);
    dbInstance = drizzle(pool, { schema, logger: process.env.NODE_ENV === 'development' });
  }

  return dbInstance;
}

export async function checkDbHealth(): Promise<{ status: 'ok' | 'error'; message: string; timestamp: Date }> {
  try {
    const pool = getPgPool();
    const result = await pool.query('SELECT NOW() as current_time, PostGIS_Version() as postgis_version');
    const version = result.rows[0]?.postgis_version || 'Unknown';
    return {
      status: 'ok',
      message: `Database connected with PostGIS: ${version}`,
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date(),
    };
  }
}

export async function closeDbPool(): Promise<void> {
  if (poolInstance) {
    await poolInstance.end();
    poolInstance = null;
    dbInstance = null;
  }
}

export { schema };
