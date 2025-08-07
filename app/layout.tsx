import '../globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import InstallButton from '@/components/InstallButton';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Uthando - Love Note Generator & Relationship Coach',
  description: 'Discover your love language, generate heartfelt AI-powered love notes, and get personalized relationship coaching',
  keywords: 'love notes, love language, AI, romance, relationships, multilingual, relationship coach, love doctor',
  authors: [{ name: 'Uthando Team' }],
  creator: 'Uthando',
  publisher: 'Uthando',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://uthando.vercel.app'),
  openGraph: {
    title: 'Uthando - Love Note Generator & Relationship Coach',
    description: 'Discover your love language, generate heartfelt AI-powered love notes, and get personalized relationship coaching',
    url: 'https://uthando.vercel.app',
    siteName: 'Uthando',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Uthando Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uthando - Love Note Generator & Relationship Coach',
    description: 'Discover your love language, generate heartfelt AI-powered love notes, and get personalized relationship coaching',
    images: ['/icon-512x512.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Uthando',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Uthando" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <InstallButton />
        </AuthProvider>
      </body>
    </html>
  );
}
