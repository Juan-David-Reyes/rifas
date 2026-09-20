import './globals.css';
import Link from 'next/link';
import Script from 'next/script';
import MarketingLayout from '../components/MarketingLayout';

import { getSiteSettings } from '../utils/settingsActions';

export async function generateMetadata() {
  const settings = await getSiteSettings()
  
  const defaultTitle = settings?.seo_title || 'deBuenas - Crea y administra tus rifas fácilmente'
  const defaultDesc = settings?.seo_description || 'La plataforma definitiva para crear y gestionar rifas solidarias, sorteos y loterías personales.'

  return {
    metadataBase: new URL('https://debuenas.co'),
    title: {
      default: defaultTitle,
      template: '%s | deBuenas',
    },
    description: defaultDesc,
    openGraph: {
      title: defaultTitle,
      description: defaultDesc,
      url: 'https://debuenas.co',
      siteName: 'deBuenas',
      locale: 'es_CO',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDesc,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

import { createClient } from '../utils/supabase/server';

export default async function RootLayout({ children }) {
  const settings = await getSiteSettings()
  
  // Checking admin status for maintenance mode override
  let isAdmin = false;
  if (settings?.maintenance_mode) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      isAdmin = user?.email === process.env.ADMIN_EMAIL;
    } catch (e) {
      // Ignorar errores de sesión
    }
  }

  const showMaintenance = settings?.maintenance_mode && !isAdmin;

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K87GGLZS');
          `}
        </Script>
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-H87MCJF9EW" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-H87MCJF9EW');
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col font-body bg-gray-50 text-gray-700" suppressHydrationWarning>
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-K87GGLZS"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {showMaintenance ? (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8 mx-auto">
              <span className="text-4xl">🛠️</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-heading text-gray-900 mb-4">
              Estamos en Mantenimiento
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Estamos realizando mejoras importantes en la plataforma para ofrecerte un mejor servicio. Volveremos a estar en línea muy pronto.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Trabajando en actualizaciones
            </div>
            {isAdmin && (
              <p className="mt-8 text-sm text-gray-400">Si eres admin, deberías poder ver la app (esto no debería renderizarse para ti).</p>
            )}
          </div>
        ) : (
          <MarketingLayout>
            {children}
          </MarketingLayout>
        )}
      </body>
    </html>
  );
}
