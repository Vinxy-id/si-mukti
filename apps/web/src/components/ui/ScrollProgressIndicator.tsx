'use client';

import React, { useEffect, useState } from 'react';

export function ScrollProgressIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 pointer-events-none bg-sky-950/10 backdrop-blur-xs">
      <div
        className="h-full bg-gradient-to-r from-[#0284C7] via-[#10B981] to-[#00236F] transition-[width] duration-150 ease-out shadow-[0_0_12px_rgba(2,132,199,0.5)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
