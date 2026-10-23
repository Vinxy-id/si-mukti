import { formatRupiah, formatTon } from './utils';

export { formatRupiah, formatTon };

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function fetchFromApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const json = await res.json();
    return json;
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Data Profil Persona Default Pengrajin: Pak Supardi (PRD Versi 1.0)
 */
export const DEFAULT_PENGRAJIN_PROFILE = {
  userId: '11111111-1111-1111-1111-111111111111',
  fullName: 'Pak Supardi',
  phoneNumber: '081234567801',
  workshop: {
    id: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Bengkel Marmer Al-Barokah',
    ownerName: 'Pak Supardi',
    paguyubanId: 'PGY-CD-001',
    subdistrict: 'Campurdarat',
    village: 'Desa Gamping',
    addressDetail: 'Jl. Raya Popoh No. 45, Sentra Bubut Karst',
    latitude: -8.1633,
    longitude: 111.8594,
    activeWorkers: 4,
    sniStatus: 'SNI 03-0394 Lolos (CaCO3 98.4%)',
  },
  wallet: {
    id: 'f1111111-ffff-ffff-ffff-ffffffffffff',
    currentBalance: 1450000,
    totalEarned: 2950000,
    totalWithdrawn: 1500000,
    bankName: 'Bank Jatim Cabang Tulungagung',
    bankAccountNumber: '0182390123',
    bankAccountHolder: 'SUPARDI',
  },
  metrics: {
    distributedTonnage: 8.5,
    activePassports: 14,
    riverDumpingPreventedKg: 8500,
  },
  activeLogistics: {
    orderCode: 'TRK-20261022-001',
    plateNumber: 'AG 8492 UT',
    vehicleType: 'Dump Truck Colt Diesel (6.5 Ton)',
    driverName: 'Budi Santoso',
    driverPhone: '082143219876',
    offtakerName: 'PT Sentosa Teraso & Paving',
    status: 'dalam_perjalanan', // menunggu_sopir | dalam_perjalanan | tiba_di_lokasi | selesai
    etaMinutes: 18,
    targetTonnage: 3.5,
  },
};
