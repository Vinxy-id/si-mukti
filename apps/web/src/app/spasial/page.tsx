'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Layers,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Info,
  Smartphone,
  ShieldCheck,
  Home,
  PlusCircle,
  Clock,
  CloudSun,
  Activity,
  Compass,
  CheckSquare,
  Square,
  Route,
  ChevronRight,
  Maximize2,
  FileText,
  Phone,
  Truck,
  X,
  Droplets,
  Award,
  LogIn,
  LogOut,
  Lock,
  Eye,
  User,
  Search,
  Building2,
  SlidersHorizontal,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useSystemStore } from '@/lib/system-store';
import {
  MOCK_GIS_WASTE_POINTS,
  MOCK_GIS_OFFTAKERS,
  type GisWasteItem,
  type GisOfftakerItem,
} from '@/lib/gis-data';
import DispatchModal from '@/components/gis/DispatchModal';
import ManifestPrintModal from '@/components/gis/ManifestPrintModal';
import { RightCommandHUD, LeftCommandHUD } from '@/components/gis/CommandCenterHUD';
import { AppBottomNav } from '@/components/layout/AppBottomNav';
import { GlobalModuleNavbar } from '@/components/layout/GlobalModuleNavbar';
import { formatRupiah } from '@/lib/utils';

// Dynamic import LeafletMap untuk mencegah error SSR
const LeafletMap = dynamic(() => import('@/components/gis/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[460px] lg:min-h-[580px] bg-gradient-to-br from-sky-50 to-blue-50/60 animate-pulse rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-3 border border-sky-100">
      <div className="w-12 h-12 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
      <div className="text-center px-4">
        <p className="text-sm font-bold text-[#00236F]">
          Memuat Sistem Spasial Komando Karst...
        </p>
        <p className="text-xs text-sky-600 mt-0.5">
          Menghubungkan citra satelit dan koordinat PostGIS Tulungagung
        </p>
      </div>
    </div>
  ),
});

export default function SpatialGisPage() {
  const { user, isLoggedIn, role, openLoginModal, logout } = useAuth();
  const { wastePoints, dispatchArmadaOrder } = useSystemStore();
  const [selectedWaste, setSelectedWaste] = useState<GisWasteItem | null>(wastePoints[0] || null);
  const [wasteTypeFilter, setWasteTypeFilter] = useState<'all' | 'sludge_lumpur' | 'afur_kasar'>('all');
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [strictSniFilter, setStrictSniFilter] = useState<boolean>(false);
  const [isMultiStopRouteActive, setIsMultiStopRouteActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Tab switcher khusus untuk Android / Mobile (< 1024px)
  const [mobileTab, setMobileTab] = useState<'map' | 'filters' | 'analytics'>('map');

  // Modal States
  const [dispatchWasteTarget, setDispatchWasteTarget] = useState<GisWasteItem | null>(null);
  const [manifestWasteTarget, setManifestWasteTarget] = useState<GisWasteItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time Clock State (Sesuai Referensi Command Center)
  const [currentTime, setCurrentTime] = useState<string>('18:50:00');
  const [currentDate, setCurrentDate] = useState<string>('2026-10-22');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour12: false }));
      setCurrentDate(now.toISOString().split('T')[0]);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter Data Spasial
  const filteredWastePoints = useMemo(() => {
    return wastePoints.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.workshopName.toLowerCase().includes(q) ||
          item.village.toLowerCase().includes(q) ||
          item.subdistrict.toLowerCase().includes(q) ||
          item.ownerName.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (wasteTypeFilter !== 'all' && item.wasteType !== wasteTypeFilter) {
        return false;
      }
      if (item.distanceKm > radiusKm) {
        return false;
      }
      if (strictSniFilter && item.caco3Pct < 95.0) {
        return false;
      }
      return true;
    });
  }, [wastePoints, searchQuery, wasteTypeFilter, radiusKm, strictSniFilter]);

  const totalFilteredTonnage = useMemo(() => {
    return filteredWastePoints.reduce((acc, cur) => acc + cur.estimatedTonnage, 0);
  }, [filteredWastePoints]);

  const activeRouteStops = useMemo(() => {
    if (!isMultiStopRouteActive) return [];
    return [...filteredWastePoints]
      .filter((w) => w.wasteType === 'sludge_lumpur')
      .slice(0, 3);
  }, [isMultiStopRouteActive, filteredWastePoints]);

  const handleDispatchSuccess = (orderCode: string) => {
    if (dispatchWasteTarget) {
      dispatchArmadaOrder(
        dispatchWasteTarget.id,
        'PT Sentosa Teraso & Paving',
        'AG 8492 UT'
      );
      setToastMessage(
        `Armada berhasil didispatch! Surat Perintah Muat ${orderCode} diterbitkan.`
      );
      setTimeout(() => setToastMessage(null), 5000);
    }
    setDispatchWasteTarget(null);
  };

  // Komponen Box Filter Spasial Reusable (Digunakan di Desktop dan Tab Filter Android)
  const FilterControlCard = () => (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-sky-100 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-sky-50">
        <span className="text-[11px] font-black text-[#00236F] uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>Radius dan Filter Spasial</span>
        </span>
        <span className="font-tabular font-black text-xs text-[#0284C7]">
          {radiusKm} km
        </span>
      </div>

      {/* Slider Radius */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500 font-semibold">
          <span>Radius Logistik Offtaker:</span>
          <strong className="text-slate-900 font-tabular">{radiusKm} km</strong>
        </div>
        <input
          type="range"
          min="2"
          max="20"
          step="1"
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
          className="w-full h-2.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>2 km</span>
          <span>Campurdarat Pusat</span>
          <span>20 km</span>
        </div>
      </div>

      {/* Tombol Kategori Residu */}
      <div className="space-y-1.5 pt-1">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight block">
          Kategori Timbulan:
        </label>
        <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setWasteTypeFilter('all')}
            className={`py-2 px-1 rounded-xl transition-all ${
              wasteTypeFilter === 'all'
                ? 'bg-[#00236F] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setWasteTypeFilter('sludge_lumpur')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              wasteTypeFilter === 'sludge_lumpur'
                ? 'bg-[#10B981] text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 shrink-0" />
            <span>Sludge</span>
          </button>
          <button
            type="button"
            onClick={() => setWasteTypeFilter('afur_kasar')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              wasteTypeFilter === 'afur_kasar'
                ? 'bg-[#F59E0B] text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>Afur</span>
          </button>
        </div>
      </div>

      {/* Checkbox SNI Mutu Batuan */}
      <div className="pt-2 border-t border-sky-50">
        <button
          type="button"
          onClick={() => setStrictSniFilter(!strictSniFilter)}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-bold select-none text-xs w-full py-1.5 text-left"
        >
          {strictSniFilter ? (
            <CheckSquare className="w-4 h-4 text-[#10B981] shrink-0" />
          ) : (
            <Square className="w-4 h-4 text-slate-400 shrink-0" />
          )}
          <span>Standar SNI 03-0394 (CaCO3 &ge; 95%)</span>
        </button>
      </div>

      {/* Tombol Rute TSP */}
      <button
        type="button"
        onClick={() => setIsMultiStopRouteActive(!isMultiStopRouteActive)}
        className={`w-full py-2.5 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
          isMultiStopRouteActive
            ? 'bg-[#00236F] text-white ring-2 ring-sky-300'
            : 'bg-gradient-to-r from-sky-50 to-blue-50 text-[#00236F] hover:bg-sky-100 border border-sky-200'
        }`}
      >
        <Route className="w-4 h-4 text-[#0284C7] shrink-0" />
        <span>{isMultiStopRouteActive ? 'Rute TSP Aktif (3 Stop)' : 'Aktifkan Optimasi Rute TSP'}</span>
      </button>
    </div>
  );

  // Komponen Popup Detail Bengkel Terpilih
  const SelectedWasteCard = ({ isMobile = false }: { isMobile?: boolean }) => {
    if (!selectedWaste) return null;

    return (
      <div
        className={`${
          isMobile
            ? 'absolute bottom-2 left-2 right-2 z-30 bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl shadow-[0_12px_30px_rgba(0,35,111,0.22)] border border-sky-200 animate-fade-in'
            : 'absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md z-30 bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-[0_15px_35px_rgba(0,35,111,0.18)] border border-sky-200 animate-fade-in pointer-events-auto'
        }`}
      >
        <div className="flex items-start justify-between gap-2 pb-2 border-b border-sky-100">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  selectedWaste.wasteType === 'sludge_lumpur'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {selectedWaste.wasteType === 'sludge_lumpur' ? (
                  <>
                    <Droplets className="w-3 h-3 text-emerald-700" />
                    <span>Sludge Kalsium</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3 h-3 text-amber-700" />
                    <span>Afur Kasar</span>
                  </>
                )}
              </span>
              <span className="text-[10px] text-slate-400 font-bold truncate">
                Jarak: {selectedWaste.distanceKm} km
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-black text-[#00236F] leading-snug truncate">
              {selectedWaste.workshopName}
            </h3>
            <p className="text-[11px] text-slate-500 truncate">
              {selectedWaste.village}, Kec. {selectedWaste.subdistrict} ({selectedWaste.ownerName})
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedWaste(null)}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 shrink-0"
            title="Tutup Popup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metrik Angka Timbulan */}
        <div className="grid grid-cols-3 gap-2 py-2.5">
          <div className="bg-sky-50/70 p-2 rounded-xl text-center border border-sky-100">
            <span className="text-[10px] text-slate-500 block">Bobot</span>
            <strong className="text-base sm:text-lg font-black font-tabular text-[#00236F]">
              {selectedWaste.estimatedTonnage}
            </strong>
            <span className="text-[10px] text-slate-500 font-bold block -mt-1">Ton</span>
          </div>

          <div className="bg-emerald-50/70 p-2 rounded-xl text-center border border-emerald-100">
            <span className="text-[10px] text-emerald-700 block truncate">CaCO3</span>
            <strong className="text-base sm:text-lg font-black font-tabular text-emerald-700">
              {selectedWaste.caco3Pct}%
            </strong>
            <span className="text-[10px] text-emerald-600 font-bold block -mt-1 truncate">SNI Mutu</span>
          </div>

          <div className="bg-amber-50/70 p-2 rounded-xl text-center border border-amber-100">
            <span className="text-[10px] text-amber-700 block truncate">Valorisasi</span>
            <strong className="text-xs sm:text-sm font-black font-tabular text-amber-800 block mt-1 truncate">
              {formatRupiah(selectedWaste.estimatedTransactionValueIdr).replace(',00', '')}
            </strong>
          </div>
        </div>

        {/* Tombol Aksi Cepat */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              if (!isLoggedIn) {
                setToastMessage('Mode Tamu: Silakan masuk sebagai Pengrajin atau Offtaker untuk menjadwalkan armada.');
                openLoginModal();
                return;
              }
              setDispatchWasteTarget(selectedWaste);
            }}
            className="flex-1 py-2 px-3 min-h-[40px] bg-[#00236F] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            {isLoggedIn ? (
              <>
                <Truck className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Jadwalkan Armada</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">Jadwalkan Armada (Masuk)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isLoggedIn) {
                setToastMessage('Mode Tamu: Silakan masuk untuk menerbitkan dan mencetak e-Manifest resmi.');
                openLoginModal();
                return;
              }
              setManifestWasteTarget(selectedWaste);
            }}
            className="p-2 min-h-[40px] min-w-[40px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors relative flex items-center justify-center"
            title={isLoggedIn ? 'Cetak e-Manifest Logistik' : 'Cetak e-Manifest (Perlu Login)'}
          >
            <FileText className="w-4 h-4 text-[#00236F]" />
            {!isLoggedIn && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-[#00236F] rounded-full flex items-center justify-center text-[9px] font-bold">
                <Lock className="w-2.5 h-2.5" />
              </span>
            )}
          </button>

          <a
            href={`https://wa.me/62${selectedWaste.contactPhone.replace(/^0/, '')}?text=Halo%20${encodeURIComponent(
              selectedWaste.ownerName
            )},%20kami%20ingin%20menjemput%20residu%20marmer%20${selectedWaste.estimatedTonnage}%20Ton.`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 min-h-[40px] min-w-[40px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 transition-colors flex items-center justify-center"
            title="Hubungi Pengrajin via WhatsApp"
          >
            <Phone className="w-4 h-4 text-[#10B981]" />
          </a>
        </div>
      </div>
    );
  };

  // Stepper TSP Multi-Stop
  const TspRouteBanner = () => {
    if (!isMultiStopRouteActive) return null;
    return (
      <div className="bg-white/90 backdrop-blur-md border border-sky-200 rounded-2xl p-3 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <span className="font-black text-[#00236F] flex items-center gap-1.5">
          <Route className="w-4 h-4 text-[#0284C7] shrink-0" />
          <span>Rute Multi-Stop Logistik Aktif (10.5 Ton):</span>
        </span>
        <div className="flex flex-wrap items-center gap-1.5 text-slate-600 font-bold">
          <span className="text-purple-700 inline-flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-purple-700" />
            <span>PT Sentosa Teraso</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-emerald-700">Stop 1: Al-Barokah (3.5T)</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-emerald-700">Stop 2: Karst Mulya (4.2T)</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-emerald-700">Stop 3: Seni Pualam (2.8T)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-slate-800 flex flex-col font-sans relative overflow-x-hidden pb-20 md:pb-6">
      {/* Background High-Tech Cyan Ambiance Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-4 right-4 max-w-md mx-auto z-50 bg-[#10B981] text-white px-4 py-3 rounded-2xl shadow-level-3 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-semibold leading-snug">{toastMessage}</p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP COMMAND BAR (Responsif untuk Android dan Windows)                  */}
      {/* ========================================================================= */}
      <header className="relative z-40 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-xs px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Judul Sistem */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/"
              className="p-1.5 sm:p-2 rounded-xl hover:bg-sky-50 text-slate-600 transition-colors shrink-0"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            </Link>

            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-2xl bg-gradient-to-br from-[#00236F] to-[#1E3A8A] flex items-center justify-center text-white shadow-sm shadow-blue-900/20 shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="flex flex-col shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-tight text-[#00236F] whitespace-nowrap">
                    SI-MUKTI
                  </span>
                  <span className="text-[10px] font-extrabold uppercase bg-sky-100 text-[#0284C7] px-1.5 py-0.2 rounded border border-sky-200 shrink-0">
                    GIS Live
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold whitespace-nowrap hidden sm:block">
                  Pusat Komando Spasial
                </p>
              </div>
            </Link>
          </div>

          {/* Navigasi Tab Tengah Desktop Terpadu (Windows Screen) */}
          <GlobalModuleNavbar className="hidden lg:flex" />

          {/* Jam Digital Real-Time & Auth Actions */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Jam Digital (Desktop/Tablet) */}
            <div className="text-right hidden xl:block">
              <div className="flex items-center gap-1.5 font-black font-tabular text-[#00236F] text-xs sm:text-sm leading-tight">
                <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{currentTime} WIB</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {currentDate}
              </p>
            </div>

            {/* Cuaca Karst (Desktop Luas) */}
            <div className="hidden 2xl:flex items-center gap-1.5 bg-gradient-to-r from-sky-50 to-cyan-50 px-3 py-1.5 rounded-2xl border border-sky-100 text-xs font-bold text-sky-800">
              <CloudSun className="w-4 h-4 text-amber-500" />
              <span>28°C Cerah &bull; Karst Selatan</span>
            </div>

            {/* Status Autentikasi Pengguna */}
            {isLoggedIn && user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/90 border border-sky-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] overflow-hidden shrink-0">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-black leading-tight text-[#00236F] truncate max-w-[120px]">{user.fullName}</p>
                    <p className="text-[9px] text-emerald-700 font-bold capitalize leading-none">{user.role.replace('_', ' ')}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                  title="Keluar dari Akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-50 text-slate-600 border border-sky-200 text-xs font-bold">
                  <Eye className="w-3.5 h-3.5 text-sky-600" />
                  <span>Mode Tamu</span>
                </div>
                <button
                  type="button"
                  onClick={() => openLoginModal()}
                  className="inline-flex items-center gap-1 sm:gap-1.5 bg-[#00236F] hover:bg-[#1E3A8A] text-white text-xs font-bold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xs transition-all active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Masuk</span>
                </button>
              </div>
            )}

            {/* Tombol Setor Residu */}
            {isLoggedIn ? (
              <Link
                href="/pengrajin/waste/new"
                className="inline-flex items-center gap-1.5 bg-[#0284C7] hover:bg-[#0369A1] active:scale-95 text-white text-xs font-bold p-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all shadow-md shadow-sky-500/20"
                title="Setor Residu Baru"
              >
                <PlusCircle className="w-4 h-4 text-cyan-200" />
                <span className="hidden sm:inline">Setor Residu</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setToastMessage('Mode Tamu: Masuk akun pengrajin untuk melapor dan menyetor timbulan residu.');
                  openLoginModal();
                }}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold p-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all border border-slate-200"
                title="Setor Residu (Login)"
              >
                <Lock className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Setor Residu</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. ANDROID SEGMENTED CONTROL BAR (Tampil hanya di layar HP / < 1024px)     */}
      {/* ========================================================================= */}
      <div className="lg:hidden px-3 pt-2.5 pb-1 sticky top-0 z-30 bg-[#F0F7FF]/95 backdrop-blur-md">
        <div className="grid grid-cols-3 gap-1 bg-white/90 p-1 rounded-2xl border border-sky-100 shadow-xs">
          <button
            type="button"
            onClick={() => setMobileTab('map')}
            className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'map'
                ? 'bg-[#00236F] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>Peta Spasial</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('filters')}
            className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'filters'
                ? 'bg-[#00236F] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
            <span>Filter & Radius</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('analytics')}
            className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'analytics'
                ? 'bg-[#00236F] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 shrink-0" />
            <span>Telemetri</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAMPILAN KHUSUS GAWAI ANDROID / MOBILE (< 1024px)                     */}
      {/* ========================================================================= */}
      <div className="lg:hidden px-3 pt-2 pb-6 space-y-3">
        {/* Tab 1: Peta Spasial Utama */}
        {mobileTab === 'map' && (
          <div className="space-y-3">
            {/* Search Bar Mobile */}
            <div className="relative">
              <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari bengkel bubut, desa, atau pemilik..."
                className="w-full pl-10 pr-9 py-2.5 bg-white/95 backdrop-blur-md border border-sky-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7] shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Banner Mode Tamu Compact */}
            {!isLoggedIn && (
              <div className="bg-sky-50/95 border border-sky-200 text-sky-950 rounded-2xl p-2.5 flex items-center justify-between text-xs backdrop-blur-md">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Eye className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="truncate text-[11px]">
                    <strong>Mode Tamu:</strong> Masuk untuk penugasan armada dan dokumen e-Manifest.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openLoginModal()}
                  className="shrink-0 ml-1.5 bg-[#00236F] text-white px-2.5 py-1 rounded-xl font-bold text-[11px] shadow-xs"
                >
                  Masuk
                </button>
              </div>
            )}

            {/* Canvas Peta Layar Penuh Responsif di Android */}
            <div className="relative w-full h-[calc(100vh-235px)] min-h-[440px] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgb(2,132,199,0.1)] border-2 border-sky-100 bg-white">
              <LeafletMap
                wastePoints={filteredWastePoints}
                offtakers={MOCK_GIS_OFFTAKERS}
                selectedWaste={selectedWaste}
                onSelectWaste={(w) => setSelectedWaste(w)}
                radiusKm={radiusKm}
                showRadiusCircle={true}
                activeRouteStops={activeRouteStops}
              />

              {/* Popup Detail Mengambang di Android */}
              <SelectedWasteCard isMobile={true} />
            </div>

            {/* Stepper Rute TSP jika Aktif */}
            <TspRouteBanner />
          </div>
        )}

        {/* Tab 2: Filter & Kontrol Spasial + Metrik Ringkas */}
        {mobileTab === 'filters' && (
          <div className="space-y-4">
            <FilterControlCard />
            <LeftCommandHUD
              totalPoints={filteredWastePoints.length}
              totalTonnage={totalFilteredTonnage}
            />
          </div>
        )}

        {/* Tab 3: Telemetri dan Analisis Gauges */}
        {mobileTab === 'analytics' && (
          <div className="space-y-4">
            <RightCommandHUD />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. TAMPILAN WINDOWS DESKTOP & LAPTOP (3-KOLOM DASHBOARD LENGKAP)          */}
      {/* ========================================================================= */}
      <main className="hidden lg:flex max-w-[1720px] w-full mx-auto p-4 xl:p-5 flex-1 flex-col gap-4 relative z-10">
        <div className="grid grid-cols-12 gap-4 items-start flex-1">
          {/* KOLOM KIRI (3 Kolom): METRIK OPERASIONAL & FILTER RADIUS */}
          <div className="col-span-3 space-y-4">
            <LeftCommandHUD
              totalPoints={filteredWastePoints.length}
              totalTonnage={totalFilteredTonnage}
            />
            <FilterControlCard />
          </div>

          {/* KOLOM TENGAH (6 Kolom): PETA SPASIAL & POPUP DETAIL */}
          <div className="col-span-6 space-y-3">
            {/* Search Bar Desktop */}
            <div className="relative">
              <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari bengkel bubut, desa, atau pengrajin marmer (contoh: Al-Barokah, Gamping, Besole)..."
                className="w-full pl-10 pr-9 py-2.5 bg-white/95 backdrop-blur-md border border-sky-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7] shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Banner Mode Tamu Desktop */}
            {!isLoggedIn && (
              <div className="bg-sky-50/95 border border-sky-200 text-sky-950 rounded-2xl p-3 sm:px-4 sm:py-2.5 flex items-center justify-between text-xs backdrop-blur-md shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Eye className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="truncate sm:whitespace-normal">
                    <strong>Mode Tamu (Publik):</strong> Eksplorasi peta dan filter radius bebas. Penugasan armada dan dokumen e-Manifest memerlukan akun pengrajin atau offtaker.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openLoginModal()}
                  className="shrink-0 ml-2 bg-[#00236F] hover:bg-[#1E3A8A] text-white px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-300" />
                  <span>Masuk Akun</span>
                </button>
              </div>
            )}

            {/* Canvas Peta Desktop */}
            <div className="relative w-full h-[calc(100vh-190px)] min-h-[620px] max-h-[840px] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgb(2,132,199,0.1)] border-2 border-sky-100 bg-white">
              {/* Radar Grid Circles Background Accent */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] border border-cyan-400/20 rounded-full pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] border border-dashed border-sky-400/20 rounded-full pointer-events-none animate-spin [animation-duration:60s]" />

              <LeafletMap
                wastePoints={filteredWastePoints}
                offtakers={MOCK_GIS_OFFTAKERS}
                selectedWaste={selectedWaste}
                onSelectWaste={(w) => setSelectedWaste(w)}
                radiusKm={radiusKm}
                showRadiusCircle={true}
                activeRouteStops={activeRouteStops}
              />

              {/* Popup Floating Card Desktop */}
              <SelectedWasteCard isMobile={false} />
            </div>

            {/* Stepper Rute TSP di Bawah Peta */}
            <TspRouteBanner />
          </div>

          {/* KOLOM KANAN (3 Kolom): TELEMETRI & ANALISIS RESIDU */}
          <div className="col-span-3 space-y-4">
            <RightCommandHUD />
          </div>
        </div>
      </main>

      {/* Modal Dispatch Armada Truk */}
      {dispatchWasteTarget && (
        <DispatchModal
          waste={dispatchWasteTarget}
          onClose={() => setDispatchWasteTarget(null)}
          onSuccess={handleDispatchSuccess}
        />
      )}

      {/* Modal Cetak Dokumen e-Manifest */}
      {manifestWasteTarget && (
        <ManifestPrintModal
          waste={manifestWasteTarget}
          onClose={() => setManifestWasteTarget(null)}
        />
      )}

      {/* Bottom Nav untuk Gawai Mobile */}
      <AppBottomNav />
    </div>
  );
}
