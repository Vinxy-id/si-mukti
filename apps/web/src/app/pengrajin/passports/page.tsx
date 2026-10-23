'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  QrCode,
  PlusCircle,
  ExternalLink,
  Download,
  Share2,
  Award,
  Sparkles,
  CheckCircle2,
  X,
  FileCheck2,
  Layers,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useSystemStore } from '@/lib/system-store';
import { BigActionButton } from '@/components/ui/BigActionButton';
import { formatRupiah, formatTon } from '@/lib/utils';
import { DEFAULT_PENGRAJIN_PROFILE } from '@/lib/api-client';

interface PassportItem {
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

const INITIAL_PASSPORTS: PassportItem[] = [
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
    productName: 'Meja Bundar Marmer Kawi Putih Kristalin',
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

export default function PengrajinPassportsPage() {
  const { isLoggedIn, openLoginModal } = useAuth();
  const { passports, addPassport } = useSystemStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeQrModal, setActiveQrModal] = useState<PassportItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [newProductName, setNewProductName] = useState('');
  const [newCategory, setNewCategory] = useState('sanitary_wastafel');
  const [newDimensions, setNewDimensions] = useState('50 x 40 x 18 cm');
  const [newWeight, setNewWeight] = useState('32.0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredPassports =
    selectedCategory === 'all'
      ? passports
      : passports.filter((p) => p.category === selectedCategory);

  const calculatedOffset = Math.round(Number(newWeight || 0) * 0.3 * 10) / 10;

  const handleCreatePassport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const randomSeq = Math.floor(1000 + Math.random() * 9000);
      const generatedSerial = `PAS-TA-2026-${randomSeq}`;
      const mockHash = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      const newEntry: PassportItem = {
        id: `pas-${Date.now()}`,
        serialNumber: generatedSerial,
        productName: newProductName,
        category: newCategory,
        categoryLabel:
          newCategory === 'sanitary_wastafel'
            ? 'Sanitari & Wastafel'
            : newCategory === 'furniture_meja'
            ? 'Mebel & Interior'
            : 'Kerajinan Bubut',
        dimensions: newDimensions,
        weightKg: Number(newWeight) || 25,
        circularWasteOffsetKg: calculatedOffset,
        cryptoHash: mockHash,
        labCertNo: 'LAB-SNI-2026/0394-081',
        quarryBatchCode: 'QRY-BSL-2026-X8',
        createdAt: 'Hari ini',
        photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
        status: 'terverifikasi',
      };

      addPassport(newEntry);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setNewProductName('');

      setToastMessage(`Berhasil menerbitkan Paspor Digital: ${generatedSerial}!`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 700);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Toast Notifikasi */}
      {toastMessage && (
        <div className="fixed top-16 left-4 right-4 z-50 bg-[#10B981] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Header Segel Keaslian Pemkab */}
      <section className="bg-gradient-to-br from-[#00236F] via-[#1E3A8A] to-[#0A192F] text-white p-5 rounded-3xl shadow-level-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-2">
              <Award className="w-3.5 h-3.5" />
              MUKTI-Trace Digital Passport
            </div>
            <h1 className="text-xl font-black tracking-tight">
              Paspor Produk Marmer
            </h1>
            <p className="text-xs text-blue-100/90 mt-1">
              Perlindungan keaslian batu alam Tulungagung dari marmer sintetis resin impor.
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black font-tabular text-amber-300">
              {passports.length}
            </span>
            <p className="text-[11px] text-blue-200">Produk Bersertifikat</p>
          </div>
        </div>

        {/* Tombol Terbitkan Paspor */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Anti-Tamper SHA-256 + HMAC</span>
          </div>
          <button
            onClick={() => {
              if (!isLoggedIn) {
                openLoginModal();
                return;
              }
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 bg-[#10B981] hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all"
          >
            {isLoggedIn ? (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Terbitkan Paspor</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-300" />
                <span>Terbitkan Paspor (Perlu Login)</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Filter Kategori */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'Semua Produk' },
          { id: 'sanitary_wastafel', label: 'Wastafel' },
          { id: 'furniture_meja', label: 'Mebel' },
          { id: 'kerajinan_souvenir', label: 'Kerajinan' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#00236F] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Daftar Kartu Paspor (Grid Responsif 1 Kolom di HP, 2-3 Kolom di Web) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPassports.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-border-chiseled p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            {/* Lencana Segel Resmi */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D97706] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                <Award className="w-3.5 h-3.5" />
                {item.serialNumber}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#10B981] bg-[#ECFDF5] border border-emerald-200 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                100% Marmer Asli
              </span>
            </div>

            {/* Informasi Produk */}
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 relative">
                <img
                  src={item.photoUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-slate-900 leading-snug truncate">
                  {item.productName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dimensi: {item.dimensions}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                  <span>
                    Berat:{' '}
                    <strong className="font-tabular text-slate-900">
                      {item.weightKg} kg
                    </strong>
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium">
                    Residu Diserap:{' '}
                    <strong className="font-tabular font-bold">
                      {item.circularWasteOffsetKg} kg
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Kartu & Tombol Aksi */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveQrModal(item)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors min-h-[44px]"
              >
                <QrCode className="w-4 h-4 text-[#00236F]" />
                Lihat Label QR
              </button>

              <Link
                href={`/verify/${item.cryptoHash}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#00236F] hover:bg-[#1E3A8A] px-3.5 py-2 rounded-xl shadow-sm transition-colors min-h-[44px]"
              >
                <span>Halaman Verifikasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Modal Terbitkan Paspor Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-[#00236F] rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Terbitkan Paspor Digital
                  </h2>
                  <p className="text-xs text-slate-500">
                    Sertifikasi Asli Marmer Tulungagung
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePassport} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Produk Marmer
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Wastafel Bulat Marmer Onyx Popoh"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#00236F] focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-[#00236F] outline-none"
                  >
                    <option value="sanitary_wastafel">Sanitari / Wastafel</option>
                    <option value="furniture_meja">Mebel / Meja</option>
                    <option value="kerajinan_souvenir">Kerajinan / Souvenir</option>
                    <option value="patung_ornamen">Patung / Ornamen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Berat Produk (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full text-sm font-tabular px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#00236F] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dimensi (Panjang x Lebar x Tinggi)
                </label>
                <input
                  type="text"
                  required
                  value={newDimensions}
                  onChange={(e) => setNewDimensions(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#00236F] outline-none"
                />
              </div>

              {/* Kalkulasi Otomatis Sirkular Zero-Waste */}
              <div className="bg-[#ECFDF5] border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900">
                  <span className="font-bold">Estimasi Residu Valorisasi Terikat: </span>
                  <strong className="font-tabular font-extrabold text-sm text-emerald-700">
                    {calculatedOffset} kg
                  </strong>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Residu pemahatan produk ini tercatat otomatis dalam buku besar sirkular SI-MUKTI untuk bahan baku paving block.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <BigActionButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00236F] hover:bg-[#1E3A8A] text-white"
                >
                  {isSubmitting ? 'Menerbitkan Paspor...' : 'Terbitkan Paspor Digital (QR)'}
                </BigActionButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tampilan Label QR Code */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setActiveQrModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Bingkai Label Paspor */}
            <div className="border-2 border-dashed border-[#00236F]/40 p-4 rounded-2xl bg-slate-50/50 mt-2">
              <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#D97706] bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full mb-2">
                <Award className="w-3.5 h-3.5" />
                {activeQrModal.serialNumber}
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                {activeQrModal.productName}
              </h4>
              <p className="text-[11px] text-slate-500 mb-3">
                Bengkel Marmer Al-Barokah • Campurdarat, Tulungagung
              </p>

              {/* QR Mock Render Visual */}
              <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border border-slate-200 shadow-inner flex flex-col items-center justify-center relative">
                <div className="w-full h-full bg-slate-900 p-2 rounded-xl flex items-center justify-center text-white text-center">
                  <div className="space-y-1">
                    <QrCode className="w-24 h-24 mx-auto text-white" />
                    <p className="text-[9px] font-mono tracking-tighter text-slate-300">
                      SCAN UNTUK VERIFIKASI KEASLIAN
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[10px] font-mono text-slate-500 mt-2 truncate">
                Hash: {activeQrModal.cryptoHash.slice(0, 24)}...
              </p>
              <p className="text-[11px] font-bold text-emerald-700 mt-1">
                SNI 03-0394 • Kalsit CaCO3 98.4%
              </p>
            </div>

            {/* Aksi Label */}
            <div className="mt-4 space-y-2">
              <Link
                href={`/verify/${activeQrModal.cryptoHash}`}
                target="_blank"
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#00236F] text-white font-bold text-xs hover:bg-[#1E3A8A] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Buka Halaman Verifikasi Konsumen
              </Link>

              <button
                onClick={() => {
                  alert('Label QR Paspor berhasil diunduh dalam format siap cetak stiker!');
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Unduh Label Siap Tempel (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
