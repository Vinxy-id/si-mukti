DO $$ BEGIN
 CREATE TYPE "public"."passport_status_enum" AS ENUM('draft', 'aktif', 'terverifikasi', 'dicabut');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."pickup_status_enum" AS ENUM('menunggu_sopir', 'dalam_perjalanan', 'tiba_di_lokasi', 'selesai', 'dibatalkan');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."pickup_stop_status_enum" AS ENUM('menunggu', 'tiba', 'timbang_muat', 'selesai_muat', 'dilewati');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."traceability_stage_enum" AS ENUM('kuari_tambang', 'bengkel_bubut', 'uji_mutu_lab', 'residu_terserap', 'pasar_konsumen');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role_enum" AS ENUM('pengrajin', 'offtaker', 'regulator_pemkab', 'laboratorium', 'konsumen');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."wallet_tx_type_enum" AS ENUM('kredit_valorisasi', 'penarikan_dana', 'penyesuaian');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."waste_status_enum" AS ENUM('tersedia', 'dijadwalkan', 'terangkut', 'terserap_pabrik');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."waste_type_enum" AS ENUM('sludge_lumpur', 'afur_kasar');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."withdrawal_status_enum" AS ENUM('pending', 'processing', 'success', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lab_test_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workshop_id" uuid NOT NULL,
	"waste_log_id" uuid,
	"certificate_number" varchar(100) NOT NULL,
	"testing_institution" varchar(200) DEFAULT 'Balai Standardisasi dan Pengujian Mutu Batuan Jawa Timur' NOT NULL,
	"test_date" date NOT NULL,
	"caco3_content_percentage" numeric(5, 2) NOT NULL,
	"moisture_content_percentage" numeric(5, 2) NOT NULL,
	"ph_level" numeric(4, 2) NOT NULL,
	"purity_grade" varchar(50) NOT NULL,
	"spectrometry_pdf_url" varchar(500),
	"is_passed" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lab_test_reports_certificate_number_unique" UNIQUE("certificate_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "offtakers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"company_name" varchar(200) NOT NULL,
	"pic_name" varchar(150) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"subdistrict" varchar(100) NOT NULL,
	"address_detail" text,
	"latitude" numeric(10, 8) NOT NULL,
	"longitude" numeric(11, 8) NOT NULL,
	"geom" geometry(Point, 4326) NOT NULL,
	"absorption_capacity_monthly_ton" numeric(10, 2) DEFAULT '150.00' NOT NULL,
	"min_caco3_required" numeric(5, 2) DEFAULT '95.00' NOT NULL,
	"max_moisture_allowed" numeric(5, 2) DEFAULT '20.00' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payout_withdrawals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" uuid NOT NULL,
	"payout_code" varchar(50) NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"bank_target" varchar(100) NOT NULL,
	"account_target" varchar(50) NOT NULL,
	"status" "withdrawal_status_enum" DEFAULT 'pending' NOT NULL,
	"transfer_receipt_url" varchar(500),
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "payout_withdrawals_payout_code_unique" UNIQUE("payout_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pickup_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_code" varchar(50) NOT NULL,
	"offtaker_id" uuid NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"scheduled_pickup_date" timestamp with time zone NOT NULL,
	"actual_pickup_date" timestamp with time zone,
	"status" "pickup_status_enum" DEFAULT 'menunggu_sopir' NOT NULL,
	"total_target_tonnage" numeric(8, 2) NOT NULL,
	"total_realized_tonnage" numeric(8, 2) DEFAULT '0.00' NOT NULL,
	"route_optimized_geojson" jsonb,
	"total_distance_km" numeric(6, 2),
	"co2_emission_saved_kg" numeric(10, 2) DEFAULT '0.00',
	"e_manifest_number" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pickup_orders_order_code_unique" UNIQUE("order_code"),
	CONSTRAINT "pickup_orders_e_manifest_number_unique" UNIQUE("e_manifest_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pickup_stops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pickup_order_id" uuid NOT NULL,
	"waste_log_id" uuid NOT NULL,
	"stop_sequence" integer NOT NULL,
	"status" varchar(30) DEFAULT 'menunggu' NOT NULL,
	"arrived_at" timestamp with time zone,
	"weighed_at" timestamp with time zone,
	"measured_weight_kg" numeric(8, 2),
	"weighing_slip_photo_url" varchar(500),
	"driver_notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_passports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"passport_uuid" varchar(64) NOT NULL,
	"workshop_id" uuid NOT NULL,
	"quarry_block_id" uuid,
	"lab_test_report_id" uuid,
	"product_name" varchar(200) NOT NULL,
	"product_category" varchar(100) NOT NULL,
	"dimensions" varchar(100) NOT NULL,
	"weight_kg" numeric(8, 2) NOT NULL,
	"finished_photo_url" varchar(500) NOT NULL,
	"circular_waste_recovered_pct" numeric(5, 2) DEFAULT '100.00' NOT NULL,
	"authenticity_seal_number" varchar(100) NOT NULL,
	"qr_code_url" varchar(500) NOT NULL,
	"cryptographic_signature" text NOT NULL,
	"status" "passport_status_enum" DEFAULT 'aktif' NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_passports_passport_uuid_unique" UNIQUE("passport_uuid"),
	CONSTRAINT "product_passports_authenticity_seal_number_unique" UNIQUE("authenticity_seal_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quarry_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"batch_code" varchar(50) NOT NULL,
	"quarry_location_name" varchar(200) NOT NULL,
	"geological_formation" varchar(150) DEFAULT 'Formasi Wonosari Karst Selatan' NOT NULL,
	"stone_variety" varchar(100) NOT NULL,
	"extraction_date" date NOT NULL,
	"caco3_baseline_pct" numeric(5, 2) NOT NULL,
	"sn_mining_permit" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quarry_blocks_batch_code_unique" UNIQUE("batch_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "regional_environmental_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"period_month" date NOT NULL,
	"subdistrict" varchar(100) NOT NULL,
	"total_waste_generated_tons" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"total_waste_absorbed_tons" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"river_dumping_prevented_tons" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"carbon_emissions_reduced_kg" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"economic_surplus_generated_idr" numeric(14, 2) DEFAULT '0.00' NOT NULL,
	"active_participating_workshops" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "traceability_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_passport_id" uuid NOT NULL,
	"stage" varchar(50) NOT NULL,
	"event_title" varchar(200) NOT NULL,
	"event_description" text NOT NULL,
	"location_name" varchar(200) NOT NULL,
	"event_timestamp" timestamp with time zone NOT NULL,
	"evidence_photo_url" varchar(500),
	"verified_by" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"role" "user_role_enum" DEFAULT 'pengrajin' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"offtaker_id" uuid NOT NULL,
	"plate_number" varchar(20) NOT NULL,
	"vehicle_type" varchar(50) DEFAULT 'Dump Truck 6-Wheeler' NOT NULL,
	"tonnage_capacity" numeric(6, 2) DEFAULT '6.00' NOT NULL,
	"driver_name" varchar(100) NOT NULL,
	"driver_phone" varchar(20) NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_plate_number_unique" UNIQUE("plate_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallet_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" uuid NOT NULL,
	"reference_pickup_stop_id" uuid,
	"transaction_code" varchar(50) NOT NULL,
	"transaction_type" "wallet_tx_type_enum" NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"balance_before" numeric(14, 2) NOT NULL,
	"balance_after" numeric(14, 2) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wallet_transactions_transaction_code_unique" UNIQUE("transaction_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workshop_id" uuid NOT NULL,
	"current_balance" numeric(14, 2) DEFAULT '0.00' NOT NULL,
	"total_earned" numeric(14, 2) DEFAULT '0.00' NOT NULL,
	"total_withdrawn" numeric(14, 2) DEFAULT '0.00' NOT NULL,
	"bank_name" varchar(100) DEFAULT 'Bank Jatim' NOT NULL,
	"bank_account_number" varchar(50) NOT NULL,
	"bank_account_holder" varchar(150) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wallets_workshop_id_unique" UNIQUE("workshop_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "waste_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workshop_id" uuid NOT NULL,
	"waste_type" "waste_type_enum" NOT NULL,
	"estimated_volume_m3" numeric(8, 3) NOT NULL,
	"estimated_tonnage" numeric(8, 2) NOT NULL,
	"actual_weighed_tonnage" numeric(8, 2),
	"rate_per_ton" numeric(12, 2) DEFAULT '150000.00' NOT NULL,
	"total_value" numeric(12, 2) NOT NULL,
	"photo_url" varchar(500) NOT NULL,
	"ai_confidence_score" numeric(4, 3) DEFAULT '0.950',
	"ai_bounding_polygon" jsonb,
	"status" "waste_status_enum" DEFAULT 'tersedia' NOT NULL,
	"latitude" numeric(10, 8) NOT NULL,
	"longitude" numeric(11, 8) NOT NULL,
	"geom" geometry(Point, 4326) NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workshops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"owner_name" varchar(150) NOT NULL,
	"paguyuban_id" varchar(50) NOT NULL,
	"subdistrict" varchar(100) NOT NULL,
	"village" varchar(100) NOT NULL,
	"address_detail" text,
	"latitude" numeric(10, 8) NOT NULL,
	"longitude" numeric(11, 8) NOT NULL,
	"geom" geometry(Point, 4326) NOT NULL,
	"is_verified" boolean DEFAULT true NOT NULL,
	"active_workers" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workshops_paguyuban_id_unique" UNIQUE("paguyuban_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lab_test_reports" ADD CONSTRAINT "lab_test_reports_workshop_id_workshops_id_fk" FOREIGN KEY ("workshop_id") REFERENCES "public"."workshops"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lab_test_reports" ADD CONSTRAINT "lab_test_reports_waste_log_id_waste_logs_id_fk" FOREIGN KEY ("waste_log_id") REFERENCES "public"."waste_logs"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offtakers" ADD CONSTRAINT "offtakers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payout_withdrawals" ADD CONSTRAINT "payout_withdrawals_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pickup_orders" ADD CONSTRAINT "pickup_orders_offtaker_id_offtakers_id_fk" FOREIGN KEY ("offtaker_id") REFERENCES "public"."offtakers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pickup_orders" ADD CONSTRAINT "pickup_orders_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pickup_stops" ADD CONSTRAINT "pickup_stops_pickup_order_id_pickup_orders_id_fk" FOREIGN KEY ("pickup_order_id") REFERENCES "public"."pickup_orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pickup_stops" ADD CONSTRAINT "pickup_stops_waste_log_id_waste_logs_id_fk" FOREIGN KEY ("waste_log_id") REFERENCES "public"."waste_logs"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_passports" ADD CONSTRAINT "product_passports_workshop_id_workshops_id_fk" FOREIGN KEY ("workshop_id") REFERENCES "public"."workshops"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_passports" ADD CONSTRAINT "product_passports_quarry_block_id_quarry_blocks_id_fk" FOREIGN KEY ("quarry_block_id") REFERENCES "public"."quarry_blocks"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_passports" ADD CONSTRAINT "product_passports_lab_test_report_id_lab_test_reports_id_fk" FOREIGN KEY ("lab_test_report_id") REFERENCES "public"."lab_test_reports"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "traceability_events" ADD CONSTRAINT "traceability_events_product_passport_id_product_passports_id_fk" FOREIGN KEY ("product_passport_id") REFERENCES "public"."product_passports"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_offtaker_id_offtakers_id_fk" FOREIGN KEY ("offtaker_id") REFERENCES "public"."offtakers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_reference_pickup_stop_id_pickup_stops_id_fk" FOREIGN KEY ("reference_pickup_stop_id") REFERENCES "public"."pickup_stops"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallets" ADD CONSTRAINT "wallets_workshop_id_workshops_id_fk" FOREIGN KEY ("workshop_id") REFERENCES "public"."workshops"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "waste_logs" ADD CONSTRAINT "waste_logs_workshop_id_workshops_id_fk" FOREIGN KEY ("workshop_id") REFERENCES "public"."workshops"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workshops" ADD CONSTRAINT "workshops_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_lab_test_reports_workshop" ON "lab_test_reports" USING btree ("workshop_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_offtakers_geom" ON "offtakers" USING gist ("geom");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_payout_withdrawals_status" ON "payout_withdrawals" USING btree ("status","requested_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pickup_orders_status" ON "pickup_orders" USING btree ("status","scheduled_pickup_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pickup_stops_order" ON "pickup_stops" USING btree ("pickup_order_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_pickup_order_sequence" ON "pickup_stops" USING btree ("pickup_order_id","stop_sequence");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_product_passports_uuid" ON "product_passports" USING btree ("passport_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_product_passports_workshop" ON "product_passports" USING btree ("workshop_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_regional_metrics_period" ON "regional_environmental_metrics" USING btree ("period_month","subdistrict");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_traceability_events_passport" ON "traceability_events" USING btree ("product_passport_id","event_timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_wallet_transactions_wallet" ON "wallet_transactions" USING btree ("wallet_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_waste_logs_geom" ON "waste_logs" USING gist ("geom");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_waste_logs_filter" ON "waste_logs" USING btree ("status","waste_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_waste_logs_workshop" ON "waste_logs" USING btree ("workshop_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_workshops_geom" ON "workshops" USING gist ("geom");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_workshops_subdistrict" ON "workshops" USING btree ("subdistrict","village");