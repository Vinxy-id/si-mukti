'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface SectionItem {
  id: string;
  label: string;
}

const SECTIONS: SectionItem[] = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'layanan', label: 'Layanan Sirkular' },
  { id: 'spesialisasi', label: 'Spesialisasi' },
  { id: 'jadwal', label: 'Jadwal Logistik' },
  { id: 'aktor', label: 'Pilar Aktor' },
  { id: 'hak-akses', label: 'Hak Akses' },
  { id: 'simulator', label: 'Kalkulator' },
  { id: 'telemetri', label: 'Dampak Riil' },
];

export function ScrollSectionNavigator() {
  const [activeSection, setActiveSection] = useState<string>('beranda');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Tampilkan navigator setelah melewati hero
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Tentukan section yang sedang aktif di viewport
      const scrollPosition = window.scrollY + 250;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = SECTIONS[i];
        if (section.id === 'beranda') {
          if (window.scrollY < 400) {
            setActiveSection('beranda');
            break;
          }
        } else {
          const el = document.getElementById(section.id);
          if (el) {
            const top = el.offsetTop;
            if (scrollPosition >= top) {
              setActiveSection(section.id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    if (id === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      aria-label="Navigasi Halaman Cepat"
      className={cn(
        'fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden 2xl:flex flex-col items-end gap-2.5 transition-all duration-300 pointer-events-none',
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
      )}
    >
      <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-sky-100 shadow-lg shadow-sky-950/5 pointer-events-auto flex flex-col gap-2">
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollTo(section.id)}
              className="group flex items-center justify-end gap-2 text-right p-1 cursor-pointer focus:outline-hidden"
              title={section.label}
            >
              {/* Tooltip Label saat Hover */}
              <span
                className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-md transition-all whitespace-nowrap shadow-xs',
                  isActive
                    ? 'bg-[#00236F] text-white opacity-100 translate-x-0'
                    : 'bg-white text-slate-600 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 border border-sky-100'
                )}
              >
                {section.label}
              </span>

              {/* Titik Indikator */}
              <div
                className={cn(
                  'rounded-full transition-all duration-300 shrink-0',
                  isActive
                    ? 'w-3 h-3 bg-[#0284C7] ring-4 ring-sky-200'
                    : 'w-2 h-2 bg-slate-300 group-hover:bg-[#0284C7] group-hover:scale-125'
                )}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
