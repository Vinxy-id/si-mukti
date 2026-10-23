import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  date,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { geometryPoint } from './custom-types';
import {
  userRoleEnum,
  wasteTypeEnum,
  wasteStatusEnum,
  pickupStatusEnum,
  passportStatusEnum,
  walletTxTypeEnum,
  withdrawalStatusEnum,
} from './enums';

// ============================================================================
// TABEL 1: users (Akun Pengguna Pentahelix)
// ============================================================================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull().unique(),
  fullName: varchar('full_name', { length: 150 }).notNull(),
  role: userRoleEnum('role').notNull().default('pengrajin'),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================================
// TABEL 2: workshops (Profil Bengkel Pengrajin Marmer Tulungagung)
// ============================================================================
export const workshops = pgTable(
  'workshops',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 200 }).notNull(),
    ownerName: varchar('owner_name', { length: 150 }).notNull(),
    paguyubanId: varchar('paguyuban_id', { length: 50 }).notNull().unique(),
    subdistrict: varchar('subdistrict', { length: 100 }).notNull(),
    village: varchar('village', { length: 100 }).notNull(),
    addressDetail: text('address_detail'),
    latitude: numeric('latitude', { precision: 10, scale: 8 }).notNull(),
    longitude: numeric('longitude', { precision: 11, scale: 8 }).notNull(),
    geom: geometryPoint('geom').notNull(),
    isVerified: boolean('is_verified').notNull().default(true),
    activeWorkers: integer('active_workers').notNull().default(3),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    idxWorkshopsGeom: index('idx_workshops_geom').using('gist', table.geom),
    idxWorkshopsSubdistrict: index('idx_workshops_subdistrict').on(
      table.subdistrict,
      table.village
    ),
  })
);

// ============================================================================
// TABEL 3: offtakers (Industri Pengolah Paving, Teraso, Pupuk Kalsium)
// ============================================================================
export const offtakers = pgTable(
  'offtakers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    companyName: varchar('company_name', { length: 200 }).notNull(),
    picName: varchar('pic_name', { length: 150 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    subdistrict: varchar('subdistrict', { length: 100 }).notNull(),
    addressDetail: text('address_detail'),
    latitude: numeric('latitude', { precision: 10, scale: 8 }).notNull(),
    longitude: numeric('longitude', { precision: 11, scale: 8 }).notNull(),
    geom: geometryPoint('geom').notNull(),
    absorptionCapacityMonthlyTon: numeric('absorption_capacity_monthly_ton', {
      precision: 10,
      scale: 2,
    })
      .notNull()
      .default('150.00'),
    minCaco3Required: numeric('min_caco3_required', { precision: 5, scale: 2 })
      .notNull()
      .default('95.00'),
    maxMoistureAllowed: numeric('max_moisture_allowed', { precision: 5, scale: 2 })
      .notNull()
      .default('20.00'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    idxOfftakersGeom: index('idx_offtakers_geom').using('gist', table.geom),
  })
);

// ============================================================================
// TABEL 4: vehicles (Armada Truk Dump Offtaker)
// ============================================================================
export const vehicles = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  offtakerId: uuid('offtaker_id')
    .notNull()
    .references(() => offtakers.id, { onDelete: 'cascade' }),
  plateNumber: varchar('plate_number', { length: 20 }).notNull().unique(),
  vehicleType: varchar('vehicle_type', { length: 50 })
    .notNull()
    .default('Dump Truck 6-Wheeler'),
  tonnageCapacity: numeric('tonnage_capacity', { precision: 6, scale: 2 })
    .notNull()
    .default('6.00'),
  driverName: varchar('driver_name', { length: 100 }).notNull(),
  driverPhone: varchar('driver_phone', { length: 20 }).notNull(),
  isAvailable: boolean('is_available').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================================
// TABEL 5: waste_logs (Pencatatan Residu Limbah & Volumetrik AI)
// ============================================================================
export const wasteLogs = pgTable(
  'waste_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workshopId: uuid('workshop_id')
      .notNull()
      .references(() => workshops.id, { onDelete: 'cascade' }),
    wasteType: wasteTypeEnum('waste_type').notNull(),
    estimatedVolumeM3: numeric('estimated_volume_m3', { precision: 8, scale: 3 }).notNull(),
    estimatedTonnage: numeric('estimated_tonnage', { precision: 8, scale: 2 }).notNull(),
    actualWeighedTonnage: numeric('actual_weighed_tonnage', { precision: 8, scale: 2 }),
    ratePerTon: numeric('rate_per_ton', { precision: 12, scale: 2 })
      .notNull()
      .default('150000.00'),
    totalValue: numeric('total_value', { precision: 12, scale: 2 }).notNull(),
    photoUrl: varchar('photo_url', { length: 500 }).notNull(),
    aiConfidenceScore: numeric('ai_confidence_score', { precision: 4, scale: 3 }).default(
      '0.950'
    ),
    aiBoundingPolygon: jsonb('ai_bounding_polygon'),
    status: wasteStatusEnum('status').notNull().default('tersedia'),
    latitude: numeric('latitude', { precision: 10, scale: 8 }).notNull(),
    longitude: numeric('longitude', { precision: 11, scale: 8 }).notNull(),
    geom: geometryPoint('geom').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    idxWasteLogsGeom: index('idx_waste_logs_geom').using('gist', table.geom),
    idxWasteLogsFilter: index('idx_waste_logs_filter').on(table.status, table.wasteType),
    idxWasteLogsWorkshop: index('idx_waste_logs_workshop').on(table.workshopId),
  })
);

// ============================================================================
// TABEL 6: lab_test_reports (Sertifikasi Spektrometri SNI 03-0394)
// ============================================================================
export const labTestReports = pgTable(
  'lab_test_reports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workshopId: uuid('workshop_id')
      .notNull()
      .references(() => workshops.id, { onDelete: 'cascade' }),
    wasteLogId: uuid('waste_log_id').references(() => wasteLogs.id, {
      onDelete: 'set null',
    }),
    certificateNumber: varchar('certificate_number', { length: 100 }).notNull().unique(),
    testingInstitution: varchar('testing_institution', { length: 200 })
      .notNull()
      .default('Balai Standardisasi dan Pengujian Mutu Batuan Jawa Timur'),
    testDate: date('test_date').notNull(),
    caco3ContentPercentage: numeric('caco3_content_percentage', {
      precision: 5,
      scale: 2,
    }).notNull(),
    moistureContentPercentage: numeric('moisture_content_percentage', {
      precision: 5,
      scale: 2,
    }).notNull(),
    phLevel: numeric('ph_level', { precision: 4, scale: 2 }).notNull(),
    purityGrade: varchar('purity_grade', { length: 50 }).notNull(),
    spectrometryPdfUrl: varchar('spectrometry_pdf_url', { length: 500 }),
    isPassed: boolean('is_passed').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    idxLabTestReportsWorkshop: index('idx_lab_test_reports_workshop').on(table.workshopId),
  })
);

// ============================================================================
// TABEL 7: pickup_orders (Penugasan Penjemputan Armada Logistik)
// ============================================================================
export const pickupOrders = pgTable(
  'pickup_orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderCode: varchar('order_code', { length: 50 }).notNull().unique(),
    offtakerId: uuid('offtaker_id')
      .notNull()
      .references(() => offtakers.id, { onDelete: 'cascade' }),
    vehicleId: uuid('vehicle_id')
      .notNull()
      .references(() => vehicles.id, { onDelete: 'restrict' }),
    scheduledPickupDate: timestamp('scheduled_pickup_date', {
      withTimezone: true,
    }).notNull(),
    actualPickupDate: timestamp('actual_pickup_date', { withTimezone: true }),
    status: pickupStatusEnum('status').notNull().default('menunggu_sopir'),
    totalTargetTonnage: numeric('total_target_tonnage', {
      precision: 8,
      scale: 2,
    }).notNull(),
    totalRealizedTonnage: numeric('total_realized_tonnage', {
      precision: 8,
      scale: 2,
    })
      .notNull()
      .default('0.00'),
    routeOptimizedGeojson: jsonb('route_optimized_geojson'),
    totalDistanceKm: numeric('total_distance_km', { precision: 6, scale: 2 }),
    co2EmissionSavedKg: numeric('co2_emission_saved_kg', {
      precision: 10,
      scale: 2,
    }).default('0.00'),
    eManifestNumber: varchar('e_manifest_number', { length: 100 }).notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    idxPickupOrdersStatus: index('idx_pickup_orders_status').on(
      table.status,
      table.scheduledPickupDate
    ),
  })
);

// ============================================================================
// TABEL 8: pickup_stops (Titik Multi-Stop Penjemputan Rute)
// ============================================================================
export const pickupStops = pgTable(
  'pickup_stops',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    pickupOrderId: uuid('pickup_order_id')
      .notNull()
      .references(() => pickupOrders.id, { onDelete: 'cascade' }),
    wasteLogId: uuid('waste_log_id')
      .notNull()
      .references(() => wasteLogs.id, { onDelete: 'restrict' }),
    stopSequence: integer('stop_sequence').notNull(),
    status: varchar('status', { length: 30 }).notNull().default('menunggu'),
    arrivedAt: timestamp('arrived_at', { withTimezone: true }),
    weighedAt: timestamp('weighed_at', { withTimezone: true }),
    measuredWeightKg: numeric('measured_weight_kg', { precision: 8, scale: 2 }),
    weighingSlipPhotoUrl: varchar('weighing_slip_photo_url', { length: 500 }),
    driverNotes: text('driver_notes'),
  },
  (table) => ({
    idxPickupStopsOrder: index('idx_pickup_stops_order').on(table.pickupOrderId),
    uqPickupOrderSequence: uniqueIndex('uq_pickup_order_sequence').on(
      table.pickupOrderId,
      table.stopSequence
    ),
  })
);

// ============================================================================
// TABEL 9: wallets (Dompet Digital MUKTI-Pay)
// ============================================================================
export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  workshopId: uuid('workshop_id')
    .notNull()
    .unique()
    .references(() => workshops.id, { onDelete: 'cascade' }),
  currentBalance: numeric('current_balance', { precision: 14, scale: 2 })
    .notNull()
    .default('0.00'),
  totalEarned: numeric('total_earned', { precision: 14, scale: 2 })
    .notNull()
    .default('0.00'),
  totalWithdrawn: numeric('total_withdrawn', { precision: 14, scale: 2 })
    .notNull()
    .default('0.00'),
  bankName: varchar('bank_name', { length: 100 }).notNull().default('Bank Jatim'),
  bankAccountNumber: varchar('bank_account_number', { length: 50 }).notNull(),
  bankAccountHolder: varchar('bank_account_holder', { length: 150 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================================
// TABEL 10: wallet_transactions (Buku Mutasi Transaksi MUKTI-Pay)
// ============================================================================
export const walletTransactions = pgTable(
  'wallet_transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    walletId: uuid('wallet_id')
      .notNull()
      .references(() => wallets.id, { onDelete: 'cascade' }),
    referencePickupStopId: uuid('reference_pickup_stop_id').references(
      () => pickupStops.id,
      { onDelete: 'set null' }
    ),
    transactionCode: varchar('transaction_code', { length: 50 }).notNull().unique(),
    transactionType: walletTxTypeEnum('transaction_type').notNull(),
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    balanceBefore: numeric('balance_before', { precision: 14, scale: 2 }).notNull(),
    balanceAfter: numeric('balance_after', { precision: 14, scale: 2 }).notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    idxWalletTransactionsWallet: index('idx_wallet_transactions_wallet').on(
      table.walletId,
      table.createdAt
    ),
  })
);

// ============================================================================
// TABEL 11: payout_withdrawals (Pencairan Saldo ke Rekening Bank)
// ============================================================================
export const payoutWithdrawals = pgTable(
  'payout_withdrawals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    walletId: uuid('wallet_id')
      .notNull()
      .references(() => wallets.id, { onDelete: 'cascade' }),
    payoutCode: varchar('payout_code', { length: 50 }).notNull().unique(),
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    bankTarget: varchar('bank_target', { length: 100 }).notNull(),
    accountTarget: varchar('account_target', { length: 50 }).notNull(),
    status: withdrawalStatusEnum('status').notNull().default('pending'),
    transferReceiptUrl: varchar('transfer_receipt_url', { length: 500 }),
    requestedAt: timestamp('requested_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (table) => ({
    idxPayoutWithdrawalsStatus: index('idx_payout_withdrawals_status').on(
      table.status,
      table.requestedAt
    ),
  })
);

// ============================================================================
// TABEL 12: quarry_blocks (Asal Bongkahan Kuari Marmer Tambang)
// ============================================================================
export const quarryBlocks = pgTable('quarry_blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  batchCode: varchar('batch_code', { length: 50 }).notNull().unique(),
  quarryLocationName: varchar('quarry_location_name', { length: 200 }).notNull(),
  geologicalFormation: varchar('geological_formation', { length: 150 })
    .notNull()
    .default('Formasi Wonosari Karst Selatan'),
  stoneVariety: varchar('stone_variety', { length: 100 }).notNull(),
  extractionDate: date('extraction_date').notNull(),
  caco3BaselinePct: numeric('caco3_baseline_pct', { precision: 5, scale: 2 }).notNull(),
  snMiningPermit: varchar('sn_mining_permit', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================================
// TABEL 13: product_passports (Paspor Digital MUKTI-Trace & Segel QR)
// ============================================================================
export const productPassports = pgTable(
  'product_passports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    passportUuid: varchar('passport_uuid', { length: 64 }).notNull().unique(),
    workshopId: uuid('workshop_id')
      .notNull()
      .references(() => workshops.id, { onDelete: 'restrict' }),
    quarryBlockId: uuid('quarry_block_id').references(() => quarryBlocks.id, {
      onDelete: 'restrict',
    }),
    labTestReportId: uuid('lab_test_report_id').references(() => labTestReports.id, {
      onDelete: 'set null',
    }),
    productName: varchar('product_name', { length: 200 }).notNull(),
    productCategory: varchar('product_category', { length: 100 }).notNull(),
    dimensions: varchar('dimensions', { length: 100 }).notNull(),
    weightKg: numeric('weight_kg', { precision: 8, scale: 2 }).notNull(),
    finishedPhotoUrl: varchar('finished_photo_url', { length: 500 }).notNull(),
    circularWasteRecoveredPct: numeric('circular_waste_recovered_pct', {
      precision: 5,
      scale: 2,
    })
      .notNull()
      .default('100.00'),
    authenticitySealNumber: varchar('authenticity_seal_number', {
      length: 100,
    })
      .notNull()
      .unique(),
    qrCodeUrl: varchar('qr_code_url', { length: 500 }).notNull(),
    cryptographicSignature: text('cryptographic_signature').notNull(),
    status: passportStatusEnum('status').notNull().default('aktif'),
    viewCount: integer('view_count').notNull().default(0),
    issuedAt: timestamp('issued_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    idxProductPassportsUuid: uniqueIndex('idx_product_passports_uuid').on(
      table.passportUuid
    ),
    idxProductPassportsWorkshop: index('idx_product_passports_workshop').on(
      table.workshopId
    ),
  })
);

// ============================================================================
// TABEL 14: traceability_events (Linimasa Jejak Ketertelusuran)
// ============================================================================
export const traceabilityEvents = pgTable(
  'traceability_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productPassportId: uuid('product_passport_id')
      .notNull()
      .references(() => productPassports.id, { onDelete: 'cascade' }),
    stage: varchar('stage', { length: 50 }).notNull(),
    eventTitle: varchar('event_title', { length: 200 }).notNull(),
    eventDescription: text('event_description').notNull(),
    locationName: varchar('location_name', { length: 200 }).notNull(),
    eventTimestamp: timestamp('event_timestamp', { withTimezone: true }).notNull(),
    evidencePhotoUrl: varchar('evidence_photo_url', { length: 500 }),
    verifiedBy: varchar('verified_by', { length: 100 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    idxTraceabilityEventsPassport: index('idx_traceability_events_passport').on(
      table.productPassportId,
      table.eventTimestamp
    ),
  })
);

// ============================================================================
// TABEL 15: regional_environmental_metrics (Analitik Telemetri Daerah)
// ============================================================================
export const regionalEnvironmentalMetrics = pgTable(
  'regional_environmental_metrics',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    periodMonth: date('period_month').notNull(),
    subdistrict: varchar('subdistrict', { length: 100 }).notNull(),
    totalWasteGeneratedTons: numeric('total_waste_generated_tons', {
      precision: 10,
      scale: 2,
    })
      .notNull()
      .default('0.00'),
    totalWasteAbsorbedTons: numeric('total_waste_absorbed_tons', {
      precision: 10,
      scale: 2,
    })
      .notNull()
      .default('0.00'),
    riverDumpingPreventedTons: numeric('river_dumping_prevented_tons', {
      precision: 10,
      scale: 2,
    })
      .notNull()
      .default('0.00'),
    carbonEmissionsReducedKg: numeric('carbon_emissions_reduced_kg', {
      precision: 10,
      scale: 2,
    })
      .notNull()
      .default('0.00'),
    economicSurplusGeneratedIdr: numeric('economic_surplus_generated_idr', {
      precision: 14,
      scale: 2,
    })
      .notNull()
      .default('0.00'),
    activeParticipatingWorkshops: integer('active_participating_workshops')
      .notNull()
      .default(0),
  },
  (table) => ({
    uqRegionalMetricsPeriod: uniqueIndex('uq_regional_metrics_period').on(
      table.periodMonth,
      table.subdistrict
    ),
  })
);
