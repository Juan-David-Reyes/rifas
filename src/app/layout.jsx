import './globals.css';
import Link from 'next/link';

import MarketingLayout from '../components/MarketingLayout';

export const metadata = {
  title: 'Rifas.io - Crea y administra tus rifas fácilmente',
  description: 'La plataforma definitiva para crear y gestionar rifas solidarias, sorteos y loterías personales.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col font-body bg-gray-50 text-gray-700">
        <MarketingLayout>
          {children}
        </MarketingLayout>
      </body>
    </html>
  );
}
