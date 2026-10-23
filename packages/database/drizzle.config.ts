import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });
dotenv.config();

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://simukti_admin:simukti_secret_2026@localhost:5432/simukti_db',
  },
  verbose: true,
  strict: true,
});
