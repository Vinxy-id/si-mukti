import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';
import { AuthProvider } from '@/lib/auth-context';
import { SystemStoreProvider } from '@/lib/system-store';
import { LoginModal } from '@/components/auth/LoginModal';
import { JuryTourPill } from '@/components/layout/JuryTourPill';

export const metadata: Metadata = {
  title: 'SI-MUKTI | Sentra Industri Marmer Tulungagung',
  description:
    'Sistem Informasi Manajemen Spasial dan Rantai Pasok Marmer Menuju Kesejahteraan UMKM Kabupaten Tulungagung Inklusif. Valorisasi residu limbah sirkular & paspor digital keaslian batu alam.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SI-MUKTI',
  },
};

export const viewport: Viewport = {
  themeColor: '#00236F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-surface-canvas text-text-primary antialiased flex flex-col">
        <AuthProvider>
          <SystemStoreProvider>
            <ServiceWorkerRegister />
            {children}
            <LoginModal />
            <JuryTourPill />
          </SystemStoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
