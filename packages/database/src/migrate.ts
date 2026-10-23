import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { getDb, getPgPool, closeDbPool } from './client';
import { sql } from 'drizzle-orm';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log('🚀 [SI-MUKTI DB] Menjalankan migrasi basis data PostGIS...');
  const pool = getPgPool();
  const db = getDb();

  try {
    // 1. Inisialisasi Ekstensi Wajib PostGIS & UUID
    console.log('🗺️ Menginisialisasi ekstensi PostgreSQL: uuid-ossp & postgis...');
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await pool.query('CREATE EXTENSION IF NOT EXISTS "postgis";');

    // 2. Jalankan migrasi Drizzle
    const migrationsFolder = path.resolve(__dirname, '../drizzle');
    console.log(`📁 Menjalankan berkas migrasi dari folder: ${migrationsFolder}`);
    await migrate(db, { migrationsFolder });

    console.log('✅ [SI-MUKTI DB] Migrasi basis data PostGIS berhasil 100%!');
  } catch (error) {
    console.error('❌ Gagal menjalankan migrasi:', error);
    throw error;
  } finally {
    await closeDbPool();
  }
}

if (process.argv[1]?.endsWith('migrate.ts')) {
  runMigrations().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
