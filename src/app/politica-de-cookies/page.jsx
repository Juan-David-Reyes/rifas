export const metadata = {
  title: 'Política de Cookies | Rifas.io',
  description: 'Información sobre el uso de cookies en Rifas.io',
};

export default function CookiesPage() {
  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 font-heading mb-8">Política de Cookies</h1>
        
        <div className="prose prose-gray max-w-none text-gray-600 space-y-6 leading-relaxed">
          <p className="font-medium text-gray-800">Última actualización: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. ¿Qué son las Cookies?</h2>
          <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo (ordenador, tablet o móvil) cuando los visitas. Sirven para que el sitio recuerde tus preferencias y acciones a lo largo del tiempo.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. ¿Cómo utilizamos las Cookies?</h2>
          <p>En Rifas.io utilizamos cookies principalmente para dos fines:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Cookies estrictamente necesarias:</strong> Aquellas indispensables para el funcionamiento de la plataforma, como mantener tu sesión de usuario iniciada a través de Supabase Auth.</li>
            <li><strong>Cookies de rendimiento y análisis:</strong> Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web, identificando qué páginas son las más visitadas para mejorar la experiencia de usuario.</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Gestión y Desactivación</h2>
          <p>Puedes configurar tu navegador web para rechazar todas o algunas de las cookies. Sin embargo, ten en cuenta que si desactivas las cookies necesarias, es posible que no puedas iniciar sesión en el panel de administración ni utilizar funciones esenciales del servicio.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Actualizaciones</h2>
          <p>Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en nuestras prácticas o por razones legales y operativas. Te invitamos a revisar esta página regularmente.</p>
        </div>
      </div>
    </div>
  );
}
