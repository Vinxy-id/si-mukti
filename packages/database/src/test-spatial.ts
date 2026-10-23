import {
  geometryPoint,
  PointCoordinate,
  pointToPostgisEWKT,
  parsePostgisPoint,
} from './schema/custom-types';
import {
  generatePassportHash,
  signPassportHash,
  verifyPassportSignature,
  formatAuthenticitySeal,
} from './helpers/crypto';
import {
  calculateHaversineDistanceKm,
  toGeoJSONFeatureCollection,
  spatialWithinRadius,
  spatialDistanceKm,
} from './helpers/spatial';
import * as schema from './schema/index';

console.log('🧪 ========================================================');
console.log('🧪 TEST SUITE: SI-MUKTI PostGIS & Drizzle Database Layer');
console.log('🧪 ========================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, extraInfo?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ [PASS] ${testName}`);
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    if (extraInfo) console.error(`   Details: ${extraInfo}`);
  }
}

// ----------------------------------------------------------------------------
// Test 1: Custom PostGIS Geometry Point
// ----------------------------------------------------------------------------
console.log('📍 1. Pengujian PostGIS Custom Point Type:');

const coord: PointCoordinate = { lng: 111.8594, lat: -8.1633 };
const driverData = pointToPostgisEWKT(coord);
assert(
  driverData === 'SRID=4326;POINT(111.8594 -8.1633)',
  'Serialisasi Point WGS84 ke PostGIS EWKT',
  `Result: ${driverData}`
);

const parsedWKT = parsePostgisPoint('SRID=4326;POINT(111.8594 -8.1633)');
assert(
  parsedWKT.lng === 111.8594 && parsedWKT.lat === -8.1633,
  'Deserialisasi PostGIS EWKT ke TypeScript PointCoordinate',
  `Result: ${JSON.stringify(parsedWKT)}`
);

const parsedObject = parsePostgisPoint({ x: 111.8701, y: -8.1882 });
assert(
  parsedObject.lng === 111.8701 && parsedObject.lat === -8.1882,
  'Deserialisasi objek Point dari pg driver {x, y}',
  `Result: ${JSON.stringify(parsedObject)}`
);

// Verifikasi column definition di table workshops
assert(
  schema.workshops.geom !== undefined,
  'Drizzle Table `workshops.geom` terdaftar dengan custom geometryPoint'
);

// ----------------------------------------------------------------------------
// Test 2: In-Memory Haversine & Geodesic Distance
// ----------------------------------------------------------------------------
console.log('\n📏 2. Pengujian Jarak Geospasial Sentra Tulungagung:');

// Jarak Bengkel Al-Barokah (Campurdarat) ke PT Sentosa (Boyolangu)
const dist1 = calculateHaversineDistanceKm(-8.1633, 111.8594, -8.1402, 111.875);
console.log(`   Jarak Campurdarat -> Boyolangu: ${dist1} km`);
assert(dist1 > 2.5 && dist1 < 3.5, 'Kalkulasi jarak Haversine Campurdarat -> Boyolangu (dalam toleransi ~3.1 km)');

// Jarak Bengkel Al-Barokah (Campurdarat) ke Bengkel Mulia (Besole)
const dist2 = calculateHaversineDistanceKm(-8.1633, 111.8594, -8.1882, 111.8701);
console.log(`   Jarak Campurdarat -> Besole: ${dist2} km`);
assert(dist2 > 2.5 && dist2 < 3.5, 'Kalkulasi jarak Haversine Campurdarat -> Besole (dalam toleransi ~3.0 km)');

// ----------------------------------------------------------------------------
// Test 3: PostGIS SQL Spatial Expressions
// ----------------------------------------------------------------------------
console.log('\n🗺️ 3. Pengujian SQL Query Expressions:');

const radiusSql = spatialWithinRadius(schema.wasteLogs.geom, 111.875, -8.1402, 10.0);
assert(
  radiusSql.queryChunks.length > 0,
  'Generasi SQL PostGIS ST_DWithin geography 10km radius'
);

const distanceSql = spatialDistanceKm(schema.wasteLogs.geom, 111.875, -8.1402);
assert(
  distanceSql.queryChunks.length > 0,
  'Generasi SQL PostGIS ST_Distance geography'
);

// ----------------------------------------------------------------------------
// Test 4: GeoJSON Feature Collection Builder
// ----------------------------------------------------------------------------
console.log('\n🌐 4. Pengujian GeoJSON RFC 7946 Converter untuk Leaflet.js:');

const sampleWorkshops = [
  {
    id: 'ws-1',
    name: 'Bengkel Al-Barokah',
    latitude: '-8.1633',
    longitude: '111.8594',
    subdistrict: 'Campurdarat',
  },
  {
    id: 'ws-2',
    name: 'Bengkel Mulia',
    latitude: '-8.1882',
    longitude: '111.8701',
    subdistrict: 'Besole',
  },
];

const geojson = toGeoJSONFeatureCollection(sampleWorkshops, 'id');
assert(geojson.type === 'FeatureCollection', 'GeoJSON type adalah FeatureCollection');
assert(geojson.features.length === 2, 'Jumlah feature sesuai data input');
assert(
  geojson.features[0].geometry.coordinates[0] === 111.8594 &&
    geojson.features[0].geometry.coordinates[1] === -8.1633,
  'Koordinat GeoJSON urutan [Longitude, Latitude] sesuai standar Leaflet'
);

// ----------------------------------------------------------------------------
// Test 5: Cryptography & Digital Product Passport (SHA-256 + HMAC)
// ----------------------------------------------------------------------------
console.log('\n🛡️ 5. Pengujian Kriptografi Paspor Digital MUKTI-Trace:');

const secretKey = 'tulungagung_test_secret_key_2026';
const passportInput = {
  serialNumber: 'REG-PEMKAB-TA/2026/09841',
  quarryBatchCode: 'QRY-BSL-2026-X8',
  labCertificateNo: 'LAB-SNI-2026/0394-081',
  workshopId: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
};

const hash = generatePassportHash(passportInput);
assert(hash.length === 64, 'SHA-256 Hash sepanjang 64 karakter heksadesimal', `Hash: ${hash}`);

const signedToken = signPassportHash(hash, secretKey);
assert(signedToken.includes('.'), 'Signed Token memiliki separator pemisah titik (hash.signature)');

const verifySuccess = verifyPassportSignature(signedToken, secretKey);
assert(verifySuccess.isValid && verifySuccess.passportHash === hash, 'Verifikasi tanda tangan digital valid');

const verifyTampered = verifyPassportSignature(`${hash}.invalid_signature_palsu`, secretKey);
assert(!verifyTampered.isValid, 'Deteksi dan tolak tanda tangan palsu (anti-tamper)');

const seal = formatAuthenticitySeal(9841, 2026);
assert(seal === 'REG-PEMKAB-TA/2026/09841', 'Format nomor segel keaslian Pemkab Tulungagung');

// ----------------------------------------------------------------------------
// Summary
// ----------------------------------------------------------------------------
console.log('\n========================================================');
console.log(`📊 Hasil Pengujian: ${passedTests}/${totalTests} pengujian BERHASIL.`);
if (passedTests === totalTests) {
  console.log('🎉 SELURUH SPESIFIKASI PROMPT 1 TERVERIFIKASI SEMPURNA!');
} else {
  console.error('⚠️ Terdapat pengujian yang gagal.');
  process.exit(1);
}
console.log('========================================================\n');
