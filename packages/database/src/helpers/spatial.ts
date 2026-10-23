import { sql, and, eq, gte, inArray, SQL } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../schema/index';
import type { WasteType } from '../schema/enums';

export interface NearbyWasteQueryParams {
  targetLat: number;
  targetLng: number;
  radiusKm?: number;
  wasteType?: WasteType;
  minCaco3?: number;
  maxMoisture?: number;
  limit?: number;
}

export interface NearbyWasteResultItem {
  wasteId: string;
  workshopId: string;
  workshopName: string;
  ownerName: string;
  paguyubanId: string;
  contactPhone: string;
  subdistrict: string;
  village: string;
  addressDetail: string | null;
  wasteType: WasteType;
  pinColorCategory: 'HIJAU_SLUDGE' | 'ORANYE_AFUR' | 'ABU_NETRAL';
  estimatedVolumeM3: string;
  estimatedTonnage: string;
  ratePerTon: string;
  estimatedTransactionValueIdr: string;
  photoUrl: string;
  aiConfidenceScore: string | null;
  wasteStatus: string;
  latitude: string;
  longitude: string;
  distanceKm: number;
  labCertNumber: string | null;
  labCaco3Pct: string | null;
  labMoisturePct: string | null;
  labPhLevel: string | null;
  labPurityGrade: string | null;
  labIsPassed: boolean | null;
  recordedAt: Date;
}

/**
 * SQL Expression Helper: Membuat titik geometri PostGIS WGS84 (SRID 4326)
 */
export function postgisPoint(lng: number, lat: number): SQL {
  return sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`;
}

/**
 * SQL Filter Helper: Cek apakah kolom geometri berada dalam radius km tertentu
 * Menggunakan casting geography untuk perhitungan geodesik akurat dalam meter
 */
export function spatialWithinRadius(geomColumn: unknown, lng: number, lat: number, radiusKm: number): SQL {
  const radiusMeters = radiusKm * 1000;
  return sql`ST_DWithin(${geomColumn}::geography, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography, ${radiusMeters})`;
}

/**
 * SQL Distance Helper: Menghitung jarak lurus geodesik dalam kilometer
 */
export function spatialDistanceKm(geomColumn: unknown, lng: number, lat: number): SQL<number> {
  return sql<number>`ROUND((ST_Distance(${geomColumn}::geography, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography) / 1000.0)::numeric, 2)`;
}

/**
 * Query Helper: fn_find_nearby_waste
 * Mencari residu limbah aktif (sludge/afur) di sekitar koordinat tertentu di Tulungagung
 * berdasarkan radius (km), jenis limbah, dan standar mutu SNI (CaCO3 min, Moisture max)
 */
export async function findNearbyWaste(
  db: NodePgDatabase<typeof schema>,
  params: NearbyWasteQueryParams
): Promise<NearbyWasteResultItem[]> {
  const radiusKm = params.radiusKm ?? 10.0;
  const limit = params.limit ?? 50;

  const distanceExpr = spatialDistanceKm(schema.wasteLogs.geom, params.targetLng, params.targetLat);

  // Buat query builder dengan Drizzle
  const conditions = [
    spatialWithinRadius(schema.wasteLogs.geom, params.targetLng, params.targetLat, radiusKm),
    inArray(schema.wasteLogs.status, ['tersedia', 'dijadwalkan']),
  ];

  if (params.wasteType) {
    conditions.push(eq(schema.wasteLogs.wasteType, params.wasteType));
  }

  if (params.minCaco3 && params.minCaco3 > 0) {
    conditions.push(gte(schema.labTestReports.caco3ContentPercentage, params.minCaco3.toString()));
  }

  const query = db
    .select({
      wasteId: schema.wasteLogs.id,
      workshopId: schema.workshops.id,
      workshopName: schema.workshops.name,
      ownerName: schema.workshops.ownerName,
      paguyubanId: schema.workshops.paguyubanId,
      contactPhone: schema.users.phoneNumber,
      subdistrict: schema.workshops.subdistrict,
      village: schema.workshops.village,
      addressDetail: schema.workshops.addressDetail,
      wasteType: schema.wasteLogs.wasteType,
      pinColorCategory: sql<'HIJAU_SLUDGE' | 'ORANYE_AFUR' | 'ABU_NETRAL'>`
        CASE 
          WHEN ${schema.wasteLogs.wasteType} = 'sludge_lumpur' THEN 'HIJAU_SLUDGE'
          WHEN ${schema.wasteLogs.wasteType} = 'afur_kasar' THEN 'ORANYE_AFUR'
          ELSE 'ABU_NETRAL'
        END
      `,
      estimatedVolumeM3: schema.wasteLogs.estimatedVolumeM3,
      estimatedTonnage: schema.wasteLogs.estimatedTonnage,
      ratePerTon: schema.wasteLogs.ratePerTon,
      estimatedTransactionValueIdr: schema.wasteLogs.totalValue,
      photoUrl: schema.wasteLogs.photoUrl,
      aiConfidenceScore: schema.wasteLogs.aiConfidenceScore,
      wasteStatus: schema.wasteLogs.status,
      latitude: schema.wasteLogs.latitude,
      longitude: schema.wasteLogs.longitude,
      distanceKm: distanceExpr,
      labCertNumber: schema.labTestReports.certificateNumber,
      labCaco3Pct: schema.labTestReports.caco3ContentPercentage,
      labMoisturePct: schema.labTestReports.moistureContentPercentage,
      labPhLevel: schema.labTestReports.phLevel,
      labPurityGrade: schema.labTestReports.purityGrade,
      labIsPassed: schema.labTestReports.isPassed,
      recordedAt: schema.wasteLogs.createdAt,
    })
    .from(schema.wasteLogs)
    .innerJoin(schema.workshops, eq(schema.wasteLogs.workshopId, schema.workshops.id))
    .innerJoin(schema.users, eq(schema.workshops.userId, schema.users.id))
    .leftJoin(schema.labTestReports, eq(schema.wasteLogs.id, schema.labTestReports.wasteLogId))
    .where(and(...conditions))
    .orderBy(distanceExpr)
    .limit(limit);

  const rawResults = await query;

  return rawResults.map((r) => ({
    ...r,
    distanceKm: Number(r.distanceKm),
  }));
}

/**
 * Query Helper: fn_find_nearby_offtakers
 * Mencari fasilitas offtaker (paving, teraso, pupuk) terdekat
 */
export async function findNearbyOfftakers(
  db: NodePgDatabase<typeof schema>,
  params: { targetLat: number; targetLng: number; radiusKm?: number }
) {
  const radiusKm = params.radiusKm ?? 15.0;
  const distanceExpr = spatialDistanceKm(schema.offtakers.geom, params.targetLng, params.targetLat);

  return db
    .select({
      offtakerId: schema.offtakers.id,
      companyName: schema.offtakers.companyName,
      picName: schema.offtakers.picName,
      phone: schema.offtakers.phone,
      subdistrict: schema.offtakers.subdistrict,
      addressDetail: schema.offtakers.addressDetail,
      absorptionCapacityMonthlyTon: schema.offtakers.absorptionCapacityMonthlyTon,
      minCaco3Required: schema.offtakers.minCaco3Required,
      maxMoistureAllowed: schema.offtakers.maxMoistureAllowed,
      latitude: schema.offtakers.latitude,
      longitude: schema.offtakers.longitude,
      distanceKm: distanceExpr,
    })
    .from(schema.offtakers)
    .where(spatialWithinRadius(schema.offtakers.geom, params.targetLng, params.targetLat, radiusKm))
    .orderBy(distanceExpr);
}

/**
 * In-memory Haversine formula distance (fallback jika dijalankan di client / non-PostGIS)
 * Mengembalikan jarak dalam kilometer
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius Bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

/**
 * GeoJSON Feature Builder untuk konsumsi Leaflet.js
 */
export interface GeoJSONFeature<P = Record<string, unknown>> {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: P;
}

export interface GeoJSONFeatureCollection<P = Record<string, unknown>> {
  type: 'FeatureCollection';
  features: GeoJSONFeature<P>[];
}

export function toGeoJSONFeatureCollection<T extends { latitude: string | number; longitude: string | number }>(
  items: T[],
  idKey: keyof T
): GeoJSONFeatureCollection<Omit<T, 'latitude' | 'longitude'>> {
  const features: GeoJSONFeature<Omit<T, 'latitude' | 'longitude'>>[] = items.map((item) => {
    const lat = typeof item.latitude === 'string' ? parseFloat(item.latitude) : item.latitude;
    const lng = typeof item.longitude === 'string' ? parseFloat(item.longitude) : item.longitude;
    const { latitude, longitude, ...props } = item;

    return {
      type: 'Feature',
      id: String(item[idKey]),
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      properties: props as Omit<T, 'latitude' | 'longitude'>,
    };
  });

  return {
    type: 'FeatureCollection',
    features,
  };
}
