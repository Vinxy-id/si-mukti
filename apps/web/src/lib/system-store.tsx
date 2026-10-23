'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MOCK_GIS_WASTE_POINTS,
  MOCK_GIS_OFFTAKERS,
  type GisWasteItem,
  type GisOfftakerItem,
} from './gis-data';
import { DEFAULT_PENGRAJIN_PROFILE } from './api-client';

export interface WalletTransactionItem {
  id: string;
  code: string;
  date: string;
  type: 'kredit_valorisasi' | 'penarikan_dana';
  amount: number;
  description: string;
  source: string;
}

export interface PassportRecord {
  id: string;
  serialNumber: string;
  productName: string;
  category: string;
  categoryLabel: string;
  dimensions: string;
  weightKg: number;
  circularWasteOffsetKg: number;
  cryptoHash: string;
  labCertNo: string;
  quarryBatchCode: string;
  createdAt: string;
  photoUrl: string;
  status: 'terverifikasi' | 'proses';
}

const INITIAL_PASSPORTS: PassportRecord[] = [
  {
    id: 'pas-001',
    serialNumber: 'PAS-TA-2026-0819',
    productName: 'Wastafel Marmer Batu Utuh Karst Popoh',
    category: 'sanitary_wastafel',
    categoryLabel: 'Sanitari & Wastafel',
    dimensions: '45 x 35 x 15 cm',
    weightKg: 28.5,
    circularWasteOffsetKg: 8.5,
    cryptoHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    labCertNo: 'LAB-SNI-2026/0394-081',
    quarryBatchCode: 'QRY-BSL-2026-X8',
    createdAt: '18 Okt 2026',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    status: 'terverifikasi',
  },
  {
    id: 'pas-002',
    serialNumber: 'PAS-TA-2026-0820',
    productName: 'Meja Bundar Top Onyx Karst Besole',
    category: 'furniture_meja',
    categoryLabel: 'Mebel & Interior',
    dimensions: 'Diameter 90 cm x 3 cm',
    weightKg: 65.0,
    circularWasteOffsetKg: 19.5,
    cryptoHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    labCertNo: 'LAB-SNI-2026/0394-081',
    quarryBatchCode: 'QRY-BSL-2026-X8',
    createdAt: '12 Okt 2026',
    photoUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
    status: 'terverifikasi',
  },
  {
    id: 'pas-003',
    serialNumber: 'PAS-TA-2026-0821',
    productName: 'Cobek Marmer Bubut Campurdarat Tradisional',
    category: 'kerajinan_souvenir',
    categoryLabel: 'Kerajinan Bubut',
    dimensions: 'Diameter 22 cm x 6 cm',
    weightKg: 4.2,
    circularWasteOffsetKg: 1.3,
    cryptoHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    labCertNo: 'LAB-SNI-2026/0394-081',
    quarryBatchCode: 'QRY-CD-2026-G4',
    createdAt: '05 Okt 2026',
    photoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    status: 'terverifikasi',
  },
];

const INITIAL_TRANSACTIONS: WalletTransactionItem[] = [
  {
    id: 'tx-1',
    code: 'TX-MKT-20261022-4129',
    date: '22 Okt 2026, 09:40 WIB',
    type: 'kredit_valorisasi',
    amount: 456000,
    description: 'Insentif penyaluran 2.85 Ton afur onyx ke PT Sentosa Teraso',
    source: 'Truk Dump AG 9012 UP (Eko Prasetyo)',
  },
  {
    id: 'tx-2',
    code: 'TX-MKT-20261016-0812',
    date: '16 Okt 2026, 14:15 WIB',
    type: 'kredit_valorisasi',
    amount: 525000,
    description: 'Insentif valorisasi 3.5 Ton sludge lumpur kalsit guci',
    source: 'Truk Dump AG 8492 UT (Budi Santoso)',
  },
  {
    id: 'tx-3',
    code: 'TX-WD-20261012-0044',
    date: '12 Okt 2026, 11:00 WIB',
    type: 'penarikan_dana',
    amount: 1000000,
    description: 'Pencairan saldo ke rekening Bank Jatim (0182390123)',
    source: 'Bank Jatim Cabang Tulungagung',
  },
];

export interface SystemStoreType {
  // Data Spasial
  wastePoints: GisWasteItem[];
  offtakers: GisOfftakerItem[];
  addWastePoint: (item: GisWasteItem) => void;
  updateWasteStatus: (id: string, status: 'tersedia' | 'dijadwalkan') => void;
  
  // Dompet & Transaksi
  walletBalance: number;
  walletTransactions: WalletTransactionItem[];
  withdrawFunds: (amount: number, bankName: string) => { success: boolean; message: string };
  
  // Paspor Produk
  passports: PassportRecord[];
  addPassport: (passport: PassportRecord) => void;
  getPassportByHashOrSerial: (query: string) => PassportRecord | undefined;
  
  // Logistik Armada
  activeLogistics: typeof DEFAULT_PENGRAJIN_PROFILE.activeLogistics;
  dispatchArmadaOrder: (wasteId: string, offtakerName: string, truckPlate: string) => void;
  completeLogisticsOrder: () => void;
  
  // Alur Skenario Demo Juri
  isTourOpen: boolean;
  tourStep: number;
  toggleTour: () => void;
  setTourStep: (step: number) => void;
  
  // Reset demo data
  resetAllData: () => void;
}

const SystemStoreContext = createContext<SystemStoreType | undefined>(undefined);

const STORAGE_KEYS = {
  WASTE_POINTS: 'si_mukti_waste_points_v1',
  WALLET_BALANCE: 'si_mukti_wallet_balance_v1',
  TRANSACTIONS: 'si_mukti_transactions_v1',
  PASSPORTS: 'si_mukti_passports_v1',
  LOGISTICS: 'si_mukti_logistics_v1',
  TOUR: 'si_mukti_tour_v1',
};

export const SystemStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wastePoints, setWastePoints] = useState<GisWasteItem[]>(MOCK_GIS_WASTE_POINTS);
  const [offtakers] = useState<GisOfftakerItem[]>(MOCK_GIS_OFFTAKERS);
  const [walletBalance, setWalletBalance] = useState<number>(DEFAULT_PENGRAJIN_PROFILE.wallet.currentBalance);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransactionItem[]>(INITIAL_TRANSACTIONS);
  const [passports, setPassports] = useState<PassportRecord[]>(INITIAL_PASSPORTS);
  const [activeLogistics, setActiveLogistics] = useState(DEFAULT_PENGRAJIN_PROFILE.activeLogistics);
  
  // State Skenario Demo Juri
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(1);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Load persistent state from localStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedPoints = localStorage.getItem(STORAGE_KEYS.WASTE_POINTS);
      if (savedPoints) setWastePoints(JSON.parse(savedPoints));

      const savedBalance = localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE);
      if (savedBalance) setWalletBalance(Number(savedBalance));

      const savedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (savedTx) setWalletTransactions(JSON.parse(savedTx));

      const savedPassports = localStorage.getItem(STORAGE_KEYS.PASSPORTS);
      if (savedPassports) setPassports(JSON.parse(savedPassports));

      const savedLogistics = localStorage.getItem(STORAGE_KEYS.LOGISTICS);
      if (savedLogistics) setActiveLogistics(JSON.parse(savedLogistics));

      const savedTour = localStorage.getItem(STORAGE_KEYS.TOUR);
      if (savedTour) setIsTourOpen(JSON.parse(savedTour));
    } catch {}
  }, []);

  // Simpan perubahan ke localStorage
  const saveState = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {}
  };

  const addWastePoint = (item: GisWasteItem) => {
    const updated = [item, ...wastePoints];
    setWastePoints(updated);
    saveState(STORAGE_KEYS.WASTE_POINTS, updated);

    // Otomatis tambahkan insentif pending / kredit valorisasi
    const newTx: WalletTransactionItem = {
      id: `tx-${Date.now()}`,
      code: `TX-MKT-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      type: 'kredit_valorisasi',
      amount: item.estimatedTransactionValueIdr,
      description: `Setor timbulan ${item.estimatedTonnage} Ton ${item.wasteType === 'sludge_lumpur' ? 'sludge kalsit' : 'afur'} ke ${item.workshopName}`,
      source: `Truk Dump Ekspedisi Karst (${item.subdistrict})`,
    };

    const updatedTx = [newTx, ...walletTransactions];
    const newBalance = walletBalance + item.estimatedTransactionValueIdr;

    setWalletTransactions(updatedTx);
    setWalletBalance(newBalance);
    saveState(STORAGE_KEYS.TRANSACTIONS, updatedTx);
    saveState(STORAGE_KEYS.WALLET_BALANCE, newBalance);
  };

  const updateWasteStatus = (id: string, status: 'tersedia' | 'dijadwalkan') => {
    const updated = wastePoints.map((w) => (w.id === id ? { ...w, status } : w));
    setWastePoints(updated);
    saveState(STORAGE_KEYS.WASTE_POINTS, updated);
  };

  const withdrawFunds = (amount: number, bankName: string) => {
    if (amount > walletBalance) {
      return { success: false, message: 'Saldo MUKTI-Pay tidak mencukupi untuk penarikan ini.' };
    }

    const newBalance = walletBalance - amount;
    const newTx: WalletTransactionItem = {
      id: `tx-wd-${Date.now()}`,
      code: `TX-WD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      type: 'penarikan_dana',
      amount,
      description: `Pencairan dana instan ke rekening ${bankName} a.n SUPARDI`,
      source: `${bankName} Cabang Tulungagung`,
    };

    const updatedTx = [newTx, ...walletTransactions];
    setWalletBalance(newBalance);
    setWalletTransactions(updatedTx);
    saveState(STORAGE_KEYS.WALLET_BALANCE, newBalance);
    saveState(STORAGE_KEYS.TRANSACTIONS, updatedTx);

    return { success: true, message: `Berhasil mencairkan dana ${amount} ke ${bankName}.` };
  };

  const addPassport = (passport: PassportRecord) => {
    const updated = [passport, ...passports];
    setPassports(updated);
    saveState(STORAGE_KEYS.PASSPORTS, updated);
  };

  const getPassportByHashOrSerial = (query: string): PassportRecord | undefined => {
    const cleanQuery = query.trim().toLowerCase();
    return passports.find(
      (p) =>
        p.cryptoHash.toLowerCase().includes(cleanQuery) ||
        p.serialNumber.toLowerCase().includes(cleanQuery)
    );
  };

  const dispatchArmadaOrder = (wasteId: string, offtakerName: string, truckPlate: string) => {
    updateWasteStatus(wasteId, 'dijadwalkan');

    const updatedLogistics = {
      ...activeLogistics,
      plateNumber: truckPlate,
      offtakerName,
      status: 'dalam_perjalanan' as const,
      etaMinutes: 12,
    };
    setActiveLogistics(updatedLogistics);
    saveState(STORAGE_KEYS.LOGISTICS, updatedLogistics);
  };

  const completeLogisticsOrder = () => {
    const updatedLogistics = {
      ...activeLogistics,
      status: 'selesai' as const,
      etaMinutes: 0,
    };
    setActiveLogistics(updatedLogistics);
    saveState(STORAGE_KEYS.LOGISTICS, updatedLogistics);
  };

  const toggleTour = () => {
    const nextState = !isTourOpen;
    setIsTourOpen(nextState);
    saveState(STORAGE_KEYS.TOUR, nextState);
  };

  const handleSetTourStep = (step: number) => {
    setTourStep(step);
  };

  const resetAllData = () => {
    setWastePoints(MOCK_GIS_WASTE_POINTS);
    setWalletBalance(DEFAULT_PENGRAJIN_PROFILE.wallet.currentBalance);
    setWalletTransactions(INITIAL_TRANSACTIONS);
    setPassports(INITIAL_PASSPORTS);
    setActiveLogistics(DEFAULT_PENGRAJIN_PROFILE.activeLogistics);

    try {
      localStorage.removeItem(STORAGE_KEYS.WASTE_POINTS);
      localStorage.removeItem(STORAGE_KEYS.WALLET_BALANCE);
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.PASSPORTS);
      localStorage.removeItem(STORAGE_KEYS.LOGISTICS);
    } catch {}
  };

  const value: SystemStoreType = {
    wastePoints: isMounted ? wastePoints : MOCK_GIS_WASTE_POINTS,
    offtakers,
    addWastePoint,
    updateWasteStatus,
    walletBalance: isMounted ? walletBalance : DEFAULT_PENGRAJIN_PROFILE.wallet.currentBalance,
    walletTransactions: isMounted ? walletTransactions : INITIAL_TRANSACTIONS,
    withdrawFunds,
    passports: isMounted ? passports : INITIAL_PASSPORTS,
    addPassport,
    getPassportByHashOrSerial,
    activeLogistics: isMounted ? activeLogistics : DEFAULT_PENGRAJIN_PROFILE.activeLogistics,
    dispatchArmadaOrder,
    completeLogisticsOrder,
    isTourOpen,
    tourStep,
    toggleTour,
    setTourStep: handleSetTourStep,
    resetAllData,
  };

  return <SystemStoreContext.Provider value={value}>{children}</SystemStoreContext.Provider>;
};

export const useSystemStore = (): SystemStoreType => {
  const context = useContext(SystemStoreContext);
  if (!context) {
    throw new Error('useSystemStore harus digunakan di dalam SystemStoreProvider');
  }
  return context;
};
