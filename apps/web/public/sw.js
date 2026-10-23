// SI-MUKTI Service Worker (Offline-First untuk Kawasan Tambang Karst Tulungagung)
const CACHE_NAME = 'simukti-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/pengrajin/dashboard',
  '/pengrajin/waste/new',
  '/spasial',
  '/manifest.json',
  '/offline.html',
];

// 1. Install Event: Cache Static Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SI-MUKTI SW] Mengunduh pre-cache aset statis & offline shell');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SI-MUKTI SW] Pre-cache warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Bersihkan cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SI-MUKTI SW] Menghapus cache versi lama:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event dengan Strategi Hibrida:
// - NetworkFirst: Untuk saldo MUKTI-Pay, transaksi dompet, dan logistik truk (prioritas data mutakhir)
// - StaleWhileRevalidate / CacheFirst: Untuk map tiles, gambar produk marmer, font Google, dan aset statis
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // A. Strategi NetworkFirst untuk endpoint API dinamis
  if (url.pathname.startsWith('/api/v1/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone dan simpan respon ke cache sebagai fallback
          if (response.status === 200) {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Jika offline di area tambang, fallback ke cache terakhir
          return caches.match(event.request);
        })
    );
    return;
  }

  // B. Strategi CacheFirst untuk Map Tiles (OSM / CartoDB) & Font
  if (
    url.hostname.includes('tile.openstreetmap.org') ||
    url.hostname.includes('cartocdn.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|woff2)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // C. StaleWhileRevalidate untuk Halaman Navigasi PWA
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Jika navigasi HTML gagal & tidak ada cache, tampilkan halaman offline
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});
