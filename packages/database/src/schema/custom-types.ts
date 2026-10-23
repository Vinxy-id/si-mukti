import { customType } from 'drizzle-orm/pg-core';

/**
 * Representasi Geometri Titik Koordinat WGS84 (SRID 4326)
 * Digunakan untuk pemetaan spasial bengkel, limbah, dan pabrik offtaker di Tulungagung
 */
export interface PointCoordinate {
  lng: number; // Longitude (Bujur Timur, contoh: 111.8594)
  lat: number; // Latitude (Lintang Selatan, contoh: -8.1633)
}

/**
 * Format GeoJSON Geometry Point standard (RFC 7946)
 */
export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

/**
 * Helper untuk mengonversi PointCoordinate ke string PostGIS EWKT
 */
export function pointToPostgisEWKT(value: PointCoordinate): string {
  if (!value || typeof value.lng !== 'number' || typeof value.lat !== 'number') {
    throw new Error(`Invalid PointCoordinate provided: ${JSON.stringify(value)}`);
  }
  return `SRID=4326;POINT(${value.lng} ${value.lat})`;
}

/**
 * Helper untuk mem-parsing PostGIS EWKT / WKT string / objek driver ke PointCoordinate
 */
export function parsePostgisPoint(value: unknown): PointCoordinate {
  if (!value) {
    return { lng: 0, lat: 0 };
  }

  // Jika driver pg mengembalikan objek point { x: lng, y: lat }
  if (typeof value === 'object' && value !== null && 'x' in value && 'y' in value) {
    const obj = value as { x: number; y: number };
    return { lng: Number(obj.x), lat: Number(obj.y) };
  }

  // Jika driver pg mengembalikan format teks WKT string (e.g. "POINT(111.8594 -8.1633)" atau "SRID=4326;POINT(...)")
  if (typeof value === 'string') {
    const wktMatch = value.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
    if (wktMatch) {
      return {
        lng: parseFloat(wktMatch[1]),
        lat: parseFloat(wktMatch[2]),
      };
    }
  }

  return { lng: 0, lat: 0 };
}

/**
 * Custom Drizzle type untuk PostgreSQL PostGIS `geometry(Point, 4326)`
 * Mengonversi otomatis antara objek TypeScript { lng, lat } dan format PostGIS
 */
export const geometryPoint = customType<{
  data: PointCoordinate;
  driverData: string | { x: number; y: number };
}>({
  dataType() {
    return 'geometry(Point, 4326)';
  },
  toDriver(value: PointCoordinate): string {
    return pointToPostgisEWKT(value);
  },
  fromDriver(value: unknown): PointCoordinate {
    return parsePostgisPoint(value);
  },
});

/**
 * Helper untuk membuat format GeoJSON dari PointCoordinate
 */
export function pointToGeoJSON(coord: PointCoordinate): GeoJSONPoint {
  return {
    type: 'Point',
    coordinates: [coord.lng, coord.lat],
  };
}
