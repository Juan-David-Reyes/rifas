import { getSiteSettings } from '../../utils/settingsActions';

export const metadata = {
  title: 'Política de Privacidad y Uso Aceptable',
  description: 'Cómo tratamos tus datos y reglas de uso en deBuenas',
};

export const dynamic = 'force-dynamic';

export default async function PrivacidadPage() {
  const settings = await getSiteSettings();
  const htmlContent = settings?.privacy_text || '<h2>Política de Privacidad</h2><p>Contenido no disponible.</p>';
  const cleanHtmlContent = htmlContent.replace(/&nbsp;/g, ' ');

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 font-heading mb-8">Política de Privacidad y Uso Aceptable</h1>
        
        <div 
          className="prose prose-gray max-w-none text-gray-600 space-y-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: cleanHtmlContent }}
        />
      </div>
    </div>
  );
}
