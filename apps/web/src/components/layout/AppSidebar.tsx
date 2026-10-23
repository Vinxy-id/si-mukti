'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DEFAULT_PENGRAJIN_PROFILE, formatRupiah } from '@/lib/api-client';
import {
  ShieldCheck,
  Sparkles,
  Home,
  PlusCircle,
  Wallet,
  Globe2,
  ExternalLink,
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useSystemStore } from '@/lib/system-store';
import { cn } from '@/lib/utils';

export interface AppSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  showCollapseToggle?: boolean;
  className?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  showCollapseToggle = true,
  className,
}) => {
  const { user, isLoggedIn } = useAuth();
  const { walletBalance } = useSystemStore();
  const profile = DEFAULT_PENGRAJIN_PROFILE;
  const pathname = usePathname();

  const sidebarNavItems = [
    {
      label: 'Beranda Dasbor',
      href: '/pengrajin/dashboard',
      icon: <Home className="w-5 h-5 shrink-0" />,
    },
    {
      label: 'Lapor Residu Limbah',
      href: '/pengrajin/waste/new',
      icon: <PlusCircle className="w-5 h-5 shrink-0" />,
      badge: 'Baru',
    },
    {
      label: 'Dompet MUKTI-Pay',
      href: '/pengrajin/wallet',
      icon: <Wallet className="w-5 h-5 shrink-0" />,
    },
    {
      label: 'Paspor Produk Saya',
      href: '/pengrajin/passports',
      icon: <ShieldCheck className="w-5 h-5 shrink-0" />,
      badge: `${profile.metrics.activePassports}`,
    },
    {
      label: 'Peta Web-GIS Spasial',
      href: '/spasial',
      icon: <Globe2 className="w-5 h-5 shrink-0" />,
    },
    {
      label: 'Verifikasi Paspor Publik',
      href: '/verify/e3b0c44298fc1c149afbf4c8996fb92427ae',
      icon: <ExternalLink className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col bg-white border-r border-border-chiseled sticky top-0 h-screen shrink-0 z-40 overflow-y-auto overflow-x-hidden transition-[width] duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-72 lg:w-80',
        className
      )}
    >
      {/* 1. Brand Header */}
      <div
        className={cn(
          'border-b border-border-chiseled bg-slate-50/50 flex items-center',
          isCollapsed ? 'p-3.5 justify-center flex-col gap-2' : 'p-5 justify-between'
        )}
      >
        <Link
          href="/"
          className={cn(
            'flex items-center group',
            isCollapsed ? 'justify-center' : 'gap-3'
          )}
          title="SI-MUKTI - Sentra Marmer Tulungagung"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00236F] to-[#1E3A8A] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-300" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-wider text-[#00236F]">
                  SI-MUKTI
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5 truncate">
                Sentra Marmer Tulungagung
              </p>
            </div>
          )}
        </Link>

        {showCollapseToggle && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              'p-2 rounded-xl text-slate-400 hover:text-[#00236F] hover:bg-slate-100 transition-colors',
              isCollapsed && 'w-8 h-8 flex items-center justify-center'
            )}
            title={isCollapsed ? 'Buka Sidebar Penuh' : 'Ciutkan Sidebar'}
            aria-label={isCollapsed ? 'Buka Sidebar' : 'Ciutkan Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#00236F]" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* 2. Profil Pengrajin / Pengguna di Sidebar */}
      <div
        className={cn(
          'mx-3 my-3 bg-gradient-to-br from-blue-50/80 to-slate-50 rounded-2xl border border-blue-100 flex items-center',
          isCollapsed ? 'p-2 justify-center' : 'p-4 gap-3'
        )}
        title={isLoggedIn && user ? `${user.fullName} (${user.role})` : `${profile.fullName} (Demo)`}
      >
        <div className="relative w-11 h-11 rounded-full border-2 border-[#00236F] bg-slate-100 overflow-hidden shrink-0 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80"
            alt={isLoggedIn && user ? user.fullName : profile.fullName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span
            className={cn(
              'absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full',
              isLoggedIn ? 'bg-[#10B981]' : 'bg-amber-400'
            )}
          />
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-sm text-[#00236F] truncate">
              {isLoggedIn && user ? user.fullName : `${profile.fullName} (Demo)`}
            </h3>
            <p className="text-xs text-slate-600 truncate font-semibold">
              {profile.workshop.name}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-1 bg-[#ECFDF5] text-[#006C49] px-2 py-0.5 rounded-md text-[10px] font-bold border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                <span>SNI Lolos</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono truncate">
                {profile.workshop.paguyubanId}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Menu Navigasi Vertikal Sidebar */}
      <nav className="flex-1 px-3 space-y-1">
        {!isCollapsed && (
          <p className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Menu Pengrajin
          </p>
        )}

        {sidebarNavItems.map((item) => {
          let isActive = false;
          if (item.href === '/pengrajin/dashboard') {
            isActive = pathname === '/pengrajin/dashboard';
          } else if (item.href === '/spasial') {
            isActive = pathname === '/spasial' || (pathname ? pathname.startsWith('/spasial') : false);
          } else if (item.href.startsWith('/verify')) {
            isActive = pathname ? pathname.startsWith('/verify') : false;
          } else {
            isActive =
              pathname === item.href ||
              (item.href !== '/' && (pathname ? pathname.startsWith(item.href) : false));
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                'relative flex items-center rounded-xl text-xs font-bold transition-all duration-300 ease-out group',
                isCollapsed
                  ? 'justify-center p-3'
                  : 'justify-between px-3.5 py-3',
                isActive
                  ? 'bg-[#00236F] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                isActive && !isCollapsed && 'translate-x-1'
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#0284C7] rounded-r-full transition-all duration-300" />
              )}

              <div className={cn('flex items-center', isCollapsed ? 'justify-center' : 'gap-3')}>
                <div
                  className={cn(
                    'p-1 rounded-lg transition-transform duration-300 shrink-0',
                    isActive
                      ? 'text-emerald-300 scale-110'
                      : 'text-slate-400 group-hover:scale-105'
                  )}
                >
                  {item.icon}
                </div>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full font-extrabold transition-colors shrink-0',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  )}
                >
                  {item.badge}
                </span>
              )}

              {isCollapsed && item.badge && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#10B981] ring-2 ring-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 4. Widget Saldo Cepat di Bawah Sidebar */}
      {!isCollapsed ? (
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
      ) : (
        <div className="p-2 mx-2 my-3 flex justify-center">
          <Link
            href="/pengrajin/wallet"
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00236F] to-[#1E3A8A] text-amber-300 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform"
            title={`Saldo MUKTI-Pay: ${formatRupiah(walletBalance)} (Klik untuk Buka Dompet)`}
          >
            <Wallet className="w-5 h-5 text-emerald-300" />
          </Link>
        </div>
      )}

      {/* 5. Footer Sidebar */}
      <div
        className={cn(
          'p-4 border-t border-border-chiseled flex items-center text-xs text-slate-500',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}
      >
        <Link
          href="/"
          className="hover:text-[#00236F] font-bold flex items-center gap-1"
          title="Kembali ke Beranda Utama"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Beranda Utama</span>}
        </Link>
        {!isCollapsed && (
          <span className="text-[11px] font-mono text-slate-400">v1.0 PRD</span>
        )}
      </div>
    </aside>
  );
};
