'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppBottomNav } from '@/components/layout/AppBottomNav';
import { GlobalModuleNavbar } from '@/components/layout/GlobalModuleNavbar';
import { DEFAULT_PENGRAJIN_PROFILE, formatRupiah } from '@/lib/api-client';
import {
  ShieldCheck,
  Bell,
  Sparkles,
  Home,
  PlusCircle,
  Wallet,
  Truck,
  Globe2,
  ExternalLink,
  Building2,
  ChevronRight,
  ArrowLeft,
  Award,
  Lock,
  LogIn,
  LogOut,
  Eye,
  User,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useSystemStore } from '@/lib/system-store';
import { cn } from '@/lib/utils';

export default function PengrajinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoggedIn, role, openLoginModal, logout } = useAuth();
  const { walletBalance, toggleTour } = useSystemStore();
  const profile = DEFAULT_PENGRAJIN_PROFILE;
  const pathname = usePathname();

  const sidebarNavItems = [
    {
      label: 'Beranda Dasbor',
      href: '/pengrajin/dashboard',
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: 'Lapor Residu Limbah',
      href: '/pengrajin/waste/new',
      icon: <PlusCircle className="w-5 h-5" />,
      badge: 'Baru',
    },
    {
      label: 'Dompet MUKTI-Pay',
      href: '/pengrajin/wallet',
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      label: 'Paspor Produk Saya',
      href: '/pengrajin/passports',
      icon: <ShieldCheck className="w-5 h-5" />,
      badge: `${profile.metrics.activePassports}`,
    },
    {
      label: 'Peta Web-GIS Spasial',
      href: '/spasial',
      icon: <Globe2 className="w-5 h-5" />,
    },
    {
      label: 'Verifikasi Paspor Publik',
      href: '/verify/e3b0c44298fc1c149afbf4c8996fb92427ae',
      icon: <ExternalLink className="w-5 h-5" />,
    },
  ];

  return (
    <div className="w-full bg-surface-canvas min-h-screen flex flex-col md:flex-row">
      {/* ========================================================================= */}
      {/* 1. SIDEBAR KHUSUS DESKTOP (Tampil di Layar >= 768px / md:flex)            */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col w-72 lg:w-80 bg-white border-r border-border-chiseled sticky top-0 h-screen shrink-0 z-40 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 border-b border-border-chiseled bg-slate-50/50">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00236F] to-[#1E3A8A] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-wider text-[#00236F]">
                  SI-MUKTI
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">
                Sentra Marmer Tulungagung
              </p>
            </div>
          </Link>
        </div>

        {/* Profil Pengrajin di Sidebar */}
        <div className="p-4 mx-3 my-3 bg-gradient-to-br from-blue-50/80 to-slate-50 rounded-2xl border border-blue-100 flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full border-2 border-[#00236F] bg-slate-100 overflow-hidden shrink-0 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80"
              alt={isLoggedIn && user ? user.fullName : profile.fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className={`absolute bottom-0 right-0 w-3 h-3 ${isLoggedIn ? 'bg-[#10B981]' : 'bg-amber-400'} border-2 border-white rounded-full`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="font-extrabold text-sm text-[#00236F] truncate">
                {isLoggedIn && user ? user.fullName : `${profile.fullName} (Demo)`}
              </h3>
            </div>
            <p className="text-xs text-slate-600 truncate font-semibold">
              {profile.workshop.name}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-1 bg-[#ECFDF5] text-[#006C49] px-2 py-0.5 rounded-md text-[10px] font-bold border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                <span>SNI Lolos</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {profile.workshop.paguyubanId}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Navigasi Vertikal Sidebar */}
        <nav className="flex-1 px-3 space-y-1">
          <p className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Menu Pengrajin
          </p>

          {sidebarNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/pengrajin/dashboard' &&
                item.href !== '/' &&
                pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-300 ease-out group',
                  isActive
                    ? 'bg-[#00236F] text-white shadow-sm translate-x-1'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#0284C7] rounded-r-full transition-all duration-300" />
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-1 rounded-lg transition-transform duration-300',
                      isActive ? 'text-emerald-300 scale-110' : 'text-slate-400 group-hover:scale-105'
                    )}
                  >
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full font-extrabold transition-colors',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Widget Saldo Cepat di Bawah Sidebar */}
        <div className="p-4 m-3 bg-gradient-to-br from-[#00236F] to-[#1E3A8A] text-white rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-blue-200 font-medium">Saldo MUKTI-Pay</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <strong className="text-xl font-black font-tabular text-amber-300">
              {formatRupiah(walletBalance)}
            </strong>
            <p className="text-[10px] text-blue-200 mt-0.5">
              Siap dicairkan ke Bank Jatim
            </p>
          </div>
          <Link
            href="/pengrajin/wallet"
            className="block text-center w-full bg-[#10B981] hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-sm"
          >
            Tarik Saldo
          </Link>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-border-chiseled flex items-center justify-between text-xs text-slate-500">
          <Link href="/" className="hover:text-[#00236F] font-bold flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda Utama</span>
          </Link>
          <span className="text-[11px] font-mono text-slate-400">v1.0 PRD</span>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. KONTEN UTAMA & HEADER RESPONSIF                                       */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Khusus Mobile (< 768px): Aplikasi Brand & Status (Tanpa Duplikasi Nama) */}
        <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            {/* Sisi Kiri: Brand Aplikasi & Peran */}
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00236F] to-[#1E3A8A] flex items-center justify-center text-white shadow-xs shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-[#00236F] tracking-tight">
                    SI-MUKTI
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#ECFDF5] text-[#006C49] border border-emerald-200">
                    Pengrajin
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium truncate">
                  Sentra Marmer Campurdarat
                </span>
              </div>
            </Link>

            {/* Sisi Kanan: Lencana Juri Demo, SNI, Avatar Profil, & Bell */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={toggleTour}
                className="flex items-center gap-1 bg-[#00236F] hover:bg-[#1E3A8A] text-amber-300 px-2 py-1 rounded-xl text-[10px] font-black border border-amber-400/90 shadow-xs active:scale-95 transition-all"
                title="Buka Alur Panduan Demonstrasi Juri LKTIN"
              >
                <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                <span>Juri Demo</span>
              </button>

              <span className="inline-flex items-center gap-1 bg-[#ECFDF5] text-[#006C49] px-2 py-0.5 rounded-lg text-[10px] font-bold border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                <span>SNI</span>
              </span>

              <div className="relative w-7 h-7 rounded-full border-2 border-[#00236F] bg-slate-100 overflow-hidden shrink-0 shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80"
                  alt={isLoggedIn && user ? user.fullName : profile.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className={`absolute bottom-0 right-0 w-2 h-2 ${isLoggedIn ? 'bg-[#10B981]' : 'bg-amber-400'} border border-white rounded-full`} />
              </div>
            </div>
          </div>
        </header>

        {/* Top Bar Khusus Desktop (>= 768px / hidden md:flex) */}
        <header className="hidden md:flex sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border-chiseled px-6 lg:px-8 py-3 items-center justify-between gap-4 shadow-xs">
          <div className="flex flex-col shrink-0">
            <h1 className="text-sm lg:text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
              Portal Pengrajin Marmer
            </h1>
            <p className="text-xs text-slate-500 whitespace-nowrap hidden sm:block">
              {profile.workshop.name} &bull; Sentra Karst Campurdarat
            </p>
          </div>

          {/* Navigasi Modul Terpadu Global */}
          <GlobalModuleNavbar className="hidden lg:flex shrink-0" />

          <div className="flex items-center gap-2.5 shrink-0">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                  <span>{user?.fullName || profile.fullName} (Terautentikasi)</span>
                </div>

                <Link
                  href="/pengrajin/waste/new"
                  className="inline-flex items-center gap-1.5 bg-[#00236F] hover:bg-[#1E3A8A] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-300" />
                  <span>+ Setor Residu</span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                  title="Keluar dari Akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="hidden 2xl:flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <span>Mode Tamu</span>
                </div>

                <button
                  type="button"
                  onClick={() => openLoginModal()}
                  className="inline-flex items-center gap-1.5 bg-[#00236F] hover:bg-[#1E3A8A] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                >
                  <LogIn className="w-4 h-4 text-amber-300" />
                  <span>Masuk Akun</span>
                </button>

                <Link
                  href="/pengrajin/waste/new"
                  className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#006C49] border border-emerald-200 text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>+ Setor Residu</span>
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Container Halaman Responsif - Padding Bawah Longgar agar Bebas dari Navbar */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-3.5 py-3 sm:p-6 lg:p-8 pb-32 md:pb-14">
          {/* Banner Peringatan Khusus Mode Tamu - Ramping & Tidak Penuh */}
          {!isLoggedIn && (
            <div className="mb-3.5 bg-gradient-to-r from-amber-50/90 to-orange-50/80 border border-amber-200/90 rounded-2xl p-2.5 sm:p-3 shadow-xs flex items-center justify-between gap-2.5 text-amber-950 animate-fade-in backdrop-blur-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-amber-400/40 text-amber-900 flex items-center justify-center shrink-0 font-bold">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs text-amber-950 truncate">
                      Pratinjau Mode Tamu (Guest Demo)
                    </span>
                    <span className="hidden sm:inline-block text-[9px] bg-amber-200/70 text-amber-900 font-bold px-1.5 py-0.2 rounded-md">
                      Simulasi
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 truncate sm:whitespace-normal">
                    Simulasi operasional bengkel <strong>Pak Supardi</strong>. Masuk akun untuk penarikan Bank Jatim & pelaporan residu.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openLoginModal()}
                className="shrink-0 bg-[#00236F] hover:bg-[#1E3A8A] text-white text-xs font-bold px-3 py-1.5 sm:py-2 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Masuk Akun</span>
                <span className="sm:hidden">Masuk</span>
              </button>
            </div>
          )}

          {children}
        </main>

        {/* Navigasi Bawah Khusus Mobile dengan Animasi Sliding Indicator */}
        <AppBottomNav />
      </div>
    </div>
  );
}
