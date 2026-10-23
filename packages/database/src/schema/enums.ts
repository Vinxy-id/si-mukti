import { pgEnum } from 'drizzle-orm/pg-core';

/**
 * Peran Pengguna Ekosistem Pentahelix SI-MUKTI Tulungagung
 */
export const userRoleEnum = pgEnum('user_role_enum', [
  'pengrajin',
  'offtaker',
  'regulator_pemkab',
  'laboratorium',
  'konsumen',
]);

/**
 * Klasifikasi Jenis Residu Limbah Marmer
 * - sludge_lumpur: Residu bubut/gergaji basah kalsium CaCO3 > 95%
 * - afur_kasar: Bongkahan pecahan batu marmer/onyx 5-15 cm
 */
export const wasteTypeEnum = pgEnum('waste_type_enum', [
  'sludge_lumpur',
  'afur_kasar',
]);

/**
 * Siklus Status Residu Limbah
 */
export const wasteStatusEnum = pgEnum('waste_status_enum', [
  'tersedia',
  'dijadwalkan',
  'terangkut',
  'terserap_pabrik',
]);

/**
 * Status Armada Logistik Penjemputan Limbah Multi-Stop
 */
export const pickupStatusEnum = pgEnum('pickup_status_enum', [
  'menunggu_sopir',
  'dalam_perjalanan',
  'tiba_di_lokasi',
  'selesai',
  'dibatalkan',
]);

/**
 * Status Titik Singgah (Stop) Penjemputan Sopir Truk
 */
export const pickupStopStatusEnum = pgEnum('pickup_stop_status_enum', [
  'menunggu',
  'tiba',
  'timbang_muat',
  'selesai_muat',
  'dilewati',
]);

/**
 * Status Paspor Digital Produk (MUKTI-Trace)
 */
export const passportStatusEnum = pgEnum('passport_status_enum', [
  'draft',
  'aktif',
  'terverifikasi',
  'dicabut',
]);

/**
 * Tipe Mutasi Buku Kas Dompet Digital MUKTI-Pay
 */
export const walletTxTypeEnum = pgEnum('wallet_tx_type_enum', [
  'kredit_valorisasi',
  'penarikan_dana',
  'penyesuaian',
]);

/**
 * Status Pengajuan Pencairan Dana ke Bank Jatim / BRI
 */
export const withdrawalStatusEnum = pgEnum('withdrawal_status_enum', [
  'pending',
  'processing',
  'success',
  'rejected',
]);

/**
 * Tahapan Linimasa Rantai Pasok Ketertelusuran Marmer
 */
export const traceabilityStageEnum = pgEnum('traceability_stage_enum', [
  'kuari_tambang',
  'bengkel_bubut',
  'uji_mutu_lab',
  'residu_terserap',
  'pasar_konsumen',
]);

export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type WasteType = (typeof wasteTypeEnum.enumValues)[number];
export type WasteStatus = (typeof wasteStatusEnum.enumValues)[number];
export type PickupStatus = (typeof pickupStatusEnum.enumValues)[number];
export type PickupStopStatus = (typeof pickupStopStatusEnum.enumValues)[number];
export type PassportStatus = (typeof passportStatusEnum.enumValues)[number];
export type WalletTxType = (typeof walletTxTypeEnum.enumValues)[number];
export type WithdrawalStatus = (typeof withdrawalStatusEnum.enumValues)[number];
export type TraceabilityStage = (typeof traceabilityStageEnum.enumValues)[number];
