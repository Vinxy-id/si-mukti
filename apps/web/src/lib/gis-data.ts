/**
 * Data Spasial Realistis Kawasan Industri Karst Tulungagung
 * Sesuai PRD SI-MUKTI Versi 1.0 (Campurdarat, Besole, Popoh, Boyolangu)
 */

export interface GisWasteItem {
  id: string;
  workshopId: string;
  workshopName: string;
  ownerName: string;
  contactPhone: string;
  subdistrict: 'Campurdarat' | 'Besole' | 'Boyolangu' | 'Tanggunggunung';
  village: string;
  addressDetail: string;
  wasteType: 'sludge_lumpur' | 'afur_kasar';
  pinColorCategory: 'HIJAU_SLUDGE' | 'ORANYE_AFUR';
  estimatedVolumeM3: number;
  estimatedTonnage: number;
  ratePerTon: number;
  estimatedTransactionValueIdr: number;
  photoUrl: string;
  aiConfidenceScore: number;
  status: 'tersedia' | 'dijadwalkan';
  latitude: number;
  longitude: number;
  distanceKm: number;
  // Metrik Laboratorium SNI 03-0394
  labCertNumber: string;
  caco3Pct: number;
  moisturePct: number;
  phLevel: number;
  purityGrade: 'A+' | 'A' | 'B';
  isPassedSni: boolean;
  recordedAt: string;
}

export interface GisOfftakerItem {
  id: string;
  companyName: string;
  industryType: 'Paving Block Ramah Lingkungan' | 'Teraso Premium' | 'Pupuk Kalsium Pertanian' | 'Bahan Bangunan Mortar';
  picName: string;
  contactPhone: string;
  subdistrict: string;
  address: string;
  minCaco3RequirementPct: number;
  weeklyCapacityTons: number;
  latitude: number;
  longitude: number;
  distanceKm: number;
  pinColorCategory: 'UNGU_PABRIK';
}

export const TULUNGAGUNG_MAP_CENTER = {
  lat: -8.1750,
  lng: 111.8650,
  zoom: 13,
};

export const MOCK_GIS_WASTE_POINTS: GisWasteItem[] = [
  {
    id: 'wst-001',
    workshopId: 'ws-cd-001',
    workshopName: 'Bengkel Marmer Al-Barokah (Pak Supardi)',
    ownerName: 'Pak Supardi',
    contactPhone: '081234567801',
    subdistrict: 'Campurdarat',
    village: 'Desa Gamping',
    addressDetail: 'Jl. Raya Popoh No. 45, Sentra Bubut Karst',
    wasteType: 'sludge_lumpur',
    pinColorCategory: 'HIJAU_SLUDGE',
    estimatedVolumeM3: 2.15,
    estimatedTonnage: 3.5,
    ratePerTon: 180000,
    estimatedTransactionValueIdr: 630000,
    photoUrl: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80',
    aiConfidenceScore: 0.94,
    status: 'tersedia',
    latitude: -8.1633,
    longitude: 111.8594,
    distanceKm: 1.4,
    labCertNumber: 'LAB-SNI-2026/0394-081',
    caco3Pct: 98.4,
    moisturePct: 16.2,
    phLevel: 8.3,
    purityGrade: 'A+',
    isPassedSni: true,
    recordedAt: '2 jam yang lalu',
  },
  {
    id: 'wst-002',
    workshopId: 'ws-cd-002',
    workshopName: 'Bengkel Bubut Karst Mulya',
    ownerName: 'Pak Darsono',
    contactPhone: '081234567802',
    subdistrict: 'Campurdarat',
    village: 'Desa Campurdarat',
    addressDetail: 'Kawasan Sentra Bubut Selatan No. 12',
    wasteType: 'sludge_lumpur',
    pinColorCategory: 'HIJAU_SLUDGE',
    estimatedVolumeM3: 2.58,
    estimatedTonnage: 4.2,
    ratePerTon: 180000,
    estimatedTransactionValueIdr: 756000,
    photoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    aiConfidenceScore: 0.91,
    status: 'tersedia',
    latitude: -8.1580,
    longitude: 111.8640,
    distanceKm: 2.1,
    labCertNumber: 'LAB-SNI-2026/0394-082',
    caco3Pct: 97.8,
    moisturePct: 18.0,
    phLevel: 8.2,
    purityGrade: 'A+',
    isPassedSni: true,
    recordedAt: '4 jam yang lalu',
  },
  {
    id: 'wst-003',
    workshopId: 'ws-cd-003',
    workshopName: 'Paguyuban Tatah Mineral Sejahtera',
    ownerName: 'H. Suwandi',
    contactPhone: '081234567803',
    subdistrict: 'Campurdarat',
    village: 'Desa Ngentrong',
    addressDetail: 'Jl. Karst Indah No. 88',
    wasteType: 'afur_kasar',
    pinColorCategory: 'ORANYE_AFUR',
    estimatedVolumeM3: 5.31,
    estimatedTonnage: 8.5,
    ratePerTon: 120000,
    estimatedTransactionValueIdr: 1020000,
    photoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    aiConfidenceScore: 0.96,
    status: 'tersedia',
    latitude: -8.1670,
    longitude: 111.8520,
    distanceKm: 1.8,
    labCertNumber: 'LAB-SNI-2026/0394-083',
    caco3Pct: 96.5,
    moisturePct: 8.5,
    phLevel: 8.1,
    purityGrade: 'A',
    isPassedSni: true,
    recordedAt: 'Kemarin',
  },
  {
    id: 'wst-004',
    workshopId: 'ws-bs-001',
    workshopName: 'CV Besole Batu Indah Utama',
    ownerName: 'Pak Kuncoro',
    contactPhone: '081234567804',
    subdistrict: 'Besole',
    village: 'Desa Besole',
    addressDetail: 'Koridor Jalur Lintas Selatan (JLS) Km 4',
    wasteType: 'sludge_lumpur',
    pinColorCategory: 'HIJAU_SLUDGE',
    estimatedVolumeM3: 3.38,
    estimatedTonnage: 5.5,
    ratePerTon: 180000,
    estimatedTransactionValueIdr: 990000,
    photoUrl: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80',
    aiConfidenceScore: 0.89,
    status: 'tersedia',
    latitude: -8.2100,
    longitude: 111.8620,
    distanceKm: 4.2,
    labCertNumber: 'LAB-SNI-2026/0394-084',
    caco3Pct: 97.2,
    moisturePct: 17.4,
    phLevel: 8.4,
    purityGrade: 'A+',
    isPassedSni: true,
    recordedAt: 'Kemarin',
  },
  {
    id: 'wst-005',
    workshopId: 'ws-bs-002',
    workshopName: 'Bengkel Potong Marmer Alam Besole Selatan',
    ownerName: 'Pak Gunawan',
    contactPhone: '081234567805',
    subdistrict: 'Besole',
    village: 'Desa Besole',
    addressDetail: 'Dekat Simpang Kuari Karst Besole',
    wasteType: 'afur_kasar',
    pinColorCategory: 'ORANYE_AFUR',
    estimatedVolumeM3: 7.5,
    estimatedTonnage: 12.0,
    ratePerTon: 120000,
    estimatedTransactionValueIdr: 1440000,
    photoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    aiConfidenceScore: 0.95,
    status: 'tersedia',
    latitude: -8.2180,
    longitude: 111.8550,
    distanceKm: 5.1,
    labCertNumber: 'LAB-SNI-2026/0394-085',
    caco3Pct: 95.9,
    moisturePct: 7.2,
    phLevel: 8.0,
    purityGrade: 'A',
    isPassedSni: true,
    recordedAt: '2 hari lalu',
  },
  {
    id: 'wst-006',
    workshopId: 'ws-cd-004',
    workshopName: 'Sentra Seni Ukir Pualam Campurdarat',
    ownerName: 'Mbah Slamet',
    contactPhone: '081234567806',
    subdistrict: 'Campurdarat',
    village: 'Desa Wates',
    addressDetail: 'Jl. Candi Boyolangu Perbatasan',
    wasteType: 'sludge_lumpur',
    pinColorCategory: 'HIJAU_SLUDGE',
    estimatedVolumeM3: 1.72,
    estimatedTonnage: 2.8,
    ratePerTon: 180000,
    estimatedTransactionValueIdr: 504000,
    photoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    aiConfidenceScore: 0.92,
    status: 'tersedia',
    latitude: -8.1720,
    longitude: 111.8680,
    distanceKm: 1.1,
    labCertNumber: 'LAB-SNI-2026/0394-086',
    caco3Pct: 98.1,
    moisturePct: 15.8,
    phLevel: 8.3,
    purityGrade: 'A+',
    isPassedSni: true,
    recordedAt: '3 jam lalu',
  },
];

export const MOCK_GIS_OFFTAKERS: GisOfftakerItem[] = [
  {
    id: 'oft-001',
    companyName: 'PT Sentosa Teraso & Paving Bersaudara',
    industryType: 'Paving Block Ramah Lingkungan',
    picName: 'H. Bambang Irawan',
    contactPhone: '081333444555',
    subdistrict: 'Boyolangu',
    address: 'Kawasan Industri Sirkular Boyolangu Km 2',
    minCaco3RequirementPct: 90.0,
    weeklyCapacityTons: 60.0,
    latitude: -8.1320,
    longitude: 111.8850,
    distanceKm: 5.8,
    pinColorCategory: 'UNGU_PABRIK',
  },
  {
    id: 'oft-002',
    companyName: 'CV Makmur Paving & Batako Karst Besole',
    industryType: 'Bahan Bangunan Mortar',
    picName: 'Ibu Ratna Juwita',
    contactPhone: '081299887766',
    subdistrict: 'Besole',
    address: 'Jl. Karst Raya Lintas Pantai Popoh No. 19',
    minCaco3RequirementPct: 85.0,
    weeklyCapacityTons: 35.0,
    latitude: -8.2050,
    longitude: 111.8700,
    distanceKm: 3.5,
    pinColorCategory: 'UNGU_PABRIK',
  },
  {
    id: 'oft-003',
    companyName: 'PT Agro Kalsium Tulungagung Mandiri',
    industryType: 'Pupuk Kalsium Pertanian',
    picName: 'Dr. Ir. Hendro Subagio',
    contactPhone: '081122334455',
    subdistrict: 'Tanggunggunung',
    address: 'Sentra Pemrosesan Dolomit Pertanian No. 3',
    minCaco3RequirementPct: 95.0,
    weeklyCapacityTons: 100.0,
    latitude: -8.1920,
    longitude: 111.8380,
    distanceKm: 4.8,
    pinColorCategory: 'UNGU_PABRIK',
  },
];

export const REGIONAL_TELEMETRY = {
  totalWasteAbsorbedTons: 142.8,
  carbonEmissionsReducedPct: -38.2, // PRD Target
  carbonEmissionsReducedKg: 54550,
  riverDumpingPreventedTons: 142.8,
  economicSurplusGeneratedIdr: 24850000,
  activeParticipatingWorkshops: 38,
  activeOfftakers: 6,
  sniPassedPct: 98.7,
};
