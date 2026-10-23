import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { getDb, schema, checkDbHealth, closeDbPool } from '@si-mukti/database';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  public readonly db: NodePgDatabase<typeof schema>;
  public readonly schema = schema;

  constructor() {
    this.db = getDb();
    this.logger.log('SI-MUKTI Database Service terhubung ke PostgreSQL PostGIS.');
  }

  async checkHealth() {
    return checkDbHealth();
  }

  async onModuleDestroy() {
    await closeDbPool();
    this.logger.log('Koneksi pool basis data SI-MUKTI ditutup.');
  }
}
