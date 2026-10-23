'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (totalHeight > 0) {
        const progress = (scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG Circular progress bar calculations (radius 18, circumference 2 * pi * 18 = 113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-40 transition-all duration-300',
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Kembali ke Bagian Atas"
        className="relative w-12 h-12 rounded-full bg-white text-[#00236F] shadow-lg shadow-sky-950/15 border border-sky-100 flex items-center justify-center hover:bg-sky-50 active:scale-90 transition-transform group cursor-pointer"
      >
        {/* SVG Progress Ring */}
        <svg className="absolute inset-0 w-12 h-12 -rotate-90 pointer-events-none" viewBox="0 0 48 48">
          {/* Background circle track */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="text-sky-100 stroke-current"
            strokeWidth="3"
            fill="transparent"
          />
          {/* Active progress track */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="text-[#0284C7] stroke-current transition-all duration-100"
            strokeWidth="3.2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Arrow Icon */}
        <ArrowUp className="w-5 h-5 text-[#00236F] group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
}
