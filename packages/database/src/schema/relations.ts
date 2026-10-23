import { relations } from 'drizzle-orm';
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
} from './tables';

export const usersRelations = relations(users, ({ one }) => ({
  workshop: one(workshops, {
    fields: [users.id],
    references: [workshops.userId],
  }),
  offtaker: one(offtakers, {
    fields: [users.id],
    references: [offtakers.userId],
  }),
}));

export const workshopsRelations = relations(workshops, ({ one, many }) => ({
  user: one(users, {
    fields: [workshops.userId],
    references: [users.id],
  }),
  wasteLogs: many(wasteLogs),
  labTestReports: many(labTestReports),
  wallet: one(wallets, {
    fields: [workshops.id],
    references: [wallets.workshopId],
  }),
  productPassports: many(productPassports),
}));

export const offtakersRelations = relations(offtakers, ({ one, many }) => ({
  user: one(users, {
    fields: [offtakers.userId],
    references: [users.id],
  }),
  vehicles: many(vehicles),
  pickupOrders: many(pickupOrders),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  offtaker: one(offtakers, {
    fields: [vehicles.offtakerId],
    references: [offtakers.id],
  }),
  pickupOrders: many(pickupOrders),
}));

export const wasteLogsRelations = relations(wasteLogs, ({ one, many }) => ({
  workshop: one(workshops, {
    fields: [wasteLogs.workshopId],
    references: [workshops.id],
  }),
  labTestReport: one(labTestReports, {
    fields: [wasteLogs.id],
    references: [labTestReports.wasteLogId],
  }),
  pickupStops: many(pickupStops),
}));

export const labTestReportsRelations = relations(labTestReports, ({ one, many }) => ({
  workshop: one(workshops, {
    fields: [labTestReports.workshopId],
    references: [workshops.id],
  }),
  wasteLog: one(wasteLogs, {
    fields: [labTestReports.wasteLogId],
    references: [wasteLogs.id],
  }),
  productPassports: many(productPassports),
}));

export const pickupOrdersRelations = relations(pickupOrders, ({ one, many }) => ({
  offtaker: one(offtakers, {
    fields: [pickupOrders.offtakerId],
    references: [offtakers.id],
  }),
  vehicle: one(vehicles, {
    fields: [pickupOrders.vehicleId],
    references: [vehicles.id],
  }),
  stops: many(pickupStops),
}));

export const pickupStopsRelations = relations(pickupStops, ({ one }) => ({
  pickupOrder: one(pickupOrders, {
    fields: [pickupStops.pickupOrderId],
    references: [pickupOrders.id],
  }),
  wasteLog: one(wasteLogs, {
    fields: [pickupStops.wasteLogId],
    references: [wasteLogs.id],
  }),
  walletTransaction: one(walletTransactions, {
    fields: [pickupStops.id],
    references: [walletTransactions.referencePickupStopId],
  }),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  workshop: one(workshops, {
    fields: [wallets.workshopId],
    references: [workshops.id],
  }),
  transactions: many(walletTransactions),
  withdrawals: many(payoutWithdrawals),
}));

export const walletTransactionsRelations = relations(walletTransactions, ({ one }) => ({
  wallet: one(wallets, {
    fields: [walletTransactions.walletId],
    references: [wallets.id],
  }),
  pickupStop: one(pickupStops, {
    fields: [walletTransactions.referencePickupStopId],
    references: [pickupStops.id],
  }),
}));

export const payoutWithdrawalsRelations = relations(payoutWithdrawals, ({ one }) => ({
  wallet: one(wallets, {
    fields: [payoutWithdrawals.walletId],
    references: [wallets.id],
  }),
}));

export const quarryBlocksRelations = relations(quarryBlocks, ({ many }) => ({
  productPassports: many(productPassports),
}));

export const productPassportsRelations = relations(productPassports, ({ one, many }) => ({
  workshop: one(workshops, {
    fields: [productPassports.workshopId],
    references: [workshops.id],
  }),
  quarryBlock: one(quarryBlocks, {
    fields: [productPassports.quarryBlockId],
    references: [quarryBlocks.id],
  }),
  labTestReport: one(labTestReports, {
    fields: [productPassports.labTestReportId],
    references: [labTestReports.id],
  }),
  events: many(traceabilityEvents),
}));

export const traceabilityEventsRelations = relations(traceabilityEvents, ({ one }) => ({
  productPassport: one(productPassports, {
    fields: [traceabilityEvents.productPassportId],
    references: [productPassports.id],
  }),
}));
