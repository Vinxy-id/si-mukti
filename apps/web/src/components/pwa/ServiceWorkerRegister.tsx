'use client';

import { useEffect } from 'react';

/**
 * ServiceWorkerRegister: Mendaftarkan Service Worker PWA SI-MUKTI di browser
 * Mengaktifkan caching offline-first untuk kawasan pertambangan pedesaan Tulungagung
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[SI-MUKTI PWA] Service Worker terdaftar dengan scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[SI-MUKTI PWA] Registrasi Service Worker gagal:', err);
        });
    }
  }, []);

  return null;
}
