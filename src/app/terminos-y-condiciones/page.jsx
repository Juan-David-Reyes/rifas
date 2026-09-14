import Link from 'next/link';
import { getSiteSettings } from '../../utils/settingsActions';

export const metadata = {
  title: 'Términos y Condiciones | Rifas.io',
  description: 'Términos y condiciones de uso de la plataforma Rifas.io',
};

export const dynamic = 'force-dynamic';

export default async function TerminosPage() {
  const settings = await getSiteSettings();
  const htmlContent = settings?.terms_text || '<h2>Términos y Condiciones</h2><p>Contenido no disponible.</p>';

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 font-heading mb-8">Términos y Condiciones</h1>
        
        <div 
          className="prose prose-gray max-w-none text-gray-600 space-y-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50 p-6 rounded-2xl">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">¿Tienes dudas sobre las reglas de la plataforma?</h3>
            <p className="text-gray-500 mt-1">Conoce qué está permitido y cómo protegemos a la comunidad.</p>
          </div>
          <Link href="/politica-de-privacidad" className="shrink-0 bg-primary-600 text-white hover:bg-primary-700 px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg">
            Leer Política de Uso Aceptable
          </Link>
        </div>
      </div>
    </div>
  );
}
