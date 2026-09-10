import './globals.css';
import Link from 'next/link';

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
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="font-heading text-2xl font-extrabold text-primary-600">
              Rifas.io
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all">
                Crear mi rifa
              </Link>
            </nav>
          </div>
        </header>
        
        <main className="flex-1">
          {children}
        </main>

        <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm mt-auto">
          <p>© Todos los derechos reservados {new Date().getFullYear()}, diseño y desarrollo por <a href="https://codigonativo.com/" className="text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">Código Nativo</a></p>
        </footer>
      </body>
    </html>
  );
}
