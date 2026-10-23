// Export custom PostGIS Geometry Types & Helpers
export * from './custom-types';

// Export Postgres Business Enums
export * from './enums';

// Export Postgres Tables
export * from './tables';

// Export Drizzle ORM Relations
export * from './relations';

import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  users,
  workshops,
  offtakers,
  vehicles,
  wasteLogs,
  labTestReports,
  pickupOrders,
  pickupStops,
  wallets,
  walletTransactions,
  payoutWithdrawals,
  quarryBlocks,
  productPassports,
  traceabilityEvents,
  regionalEnvironmentalMetrics,
} from './tables';

// ============================================================================
// TypeScript Inferred Types (Select & Insert Models)
// ============================================================================

// Users
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Workshops
export type Workshop = InferSelectModel<typeof workshops>;
export type NewWorkshop = InferInsertModel<typeof workshops>;

// Offtakers
export type Offtaker = InferSelectModel<typeof offtakers>;
export type NewOfftaker = InferInsertModel<typeof offtakers>;

// Vehicles
export type Vehicle = InferSelectModel<typeof vehicles>;
export type NewVehicle = InferInsertModel<typeof vehicles>;

// Waste Logs
export type WasteLog = InferSelectModel<typeof wasteLogs>;
export type NewWasteLog = InferInsertModel<typeof wasteLogs>;

// Lab Test Reports
export type LabTestReport = InferSelectModel<typeof labTestReports>;
export type NewLabTestReport = InferInsertModel<typeof labTestReports>;

// Pickup Orders
export type PickupOrder = InferSelectModel<typeof pickupOrders>;
export type NewPickupOrder = InferInsertModel<typeof pickupOrders>;

// Pickup Stops
export type PickupStop = InferSelectModel<typeof pickupStops>;
export type NewPickupStop = InferInsertModel<typeof pickupStops>;

// Wallets
export type Wallet = InferSelectModel<typeof wallets>;
export type NewWallet = InferInsertModel<typeof wallets>;

// Wallet Transactions
export type WalletTransaction = InferSelectModel<typeof walletTransactions>;
export type NewWalletTransaction = InferInsertModel<typeof walletTransactions>;

// Payout Withdrawals
export type PayoutWithdrawal = InferSelectModel<typeof payoutWithdrawals>;
export type NewPayoutWithdrawal = InferInsertModel<typeof payoutWithdrawals>;

// Quarry Blocks
export type QuarryBlock = InferSelectModel<typeof quarryBlocks>;
export type NewQuarryBlock = InferInsertModel<typeof quarryBlocks>;

// Product Passports
export type ProductPassport = InferSelectModel<typeof productPassports>;
export type NewProductPassport = InferInsertModel<typeof productPassports>;

// Traceability Events
export type TraceabilityEvent = InferSelectModel<typeof traceabilityEvents>;
export type NewTraceabilityEvent = InferInsertModel<typeof traceabilityEvents>;

// Regional Environmental Metrics
export type RegionalEnvironmentalMetric = InferSelectModel<
  typeof regionalEnvironmentalMetrics
>;
export type NewRegionalEnvironmentalMetric = InferInsertModel<
  typeof regionalEnvironmentalMetrics
>;
