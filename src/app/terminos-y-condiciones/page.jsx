import Link from 'next/link';

export const metadata = {
  title: 'Términos y Condiciones | Rifas.io',
  description: 'Términos y condiciones de uso de la plataforma Rifas.io',
};

export default function TerminosPage() {
  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 font-heading mb-8">Términos y Condiciones</h1>
        
        <div className="prose prose-gray max-w-none text-gray-600 space-y-6 leading-relaxed">
          <p className="font-medium text-gray-800">Última actualización: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introducción</h2>
          <p>Bienvenido a Rifas.io. Al acceder y utilizar nuestra plataforma web ("el Servicio"), aceptas cumplir con los presentes términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al Servicio.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Naturaleza del Servicio (SaaS)</h2>
          <p>Rifas.io proporciona exclusivamente una herramienta de software (SaaS) diseñada para facilitar la autogestión de sorteos y rifas. <strong>Nosotros no organizamos, operamos, patrocinamos ni nos hacemos responsables por ningún sorteo.</strong> No recolectamos fondos de participantes ni gestionamos la entrega de premios.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Obligaciones del Organizador</h2>
          <p>El usuario que crea un sorteo (el "Organizador") asume la total responsabilidad legal, fiscal y operativa de la rifa. El Organizador garantiza que cumple con todas las leyes locales, regulaciones de juegos de azar (ej. Coljuegos en Colombia) y normativas aplicables a su jurisdicción antes de lanzar cualquier campaña pública.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Relación con los Participantes</h2>
          <p>Cualquier disputa relacionada con pagos, entrega de premios, o transparencia del sorteo debe resolverse directamente entre el Participante y el Organizador. Rifas.io no actúa como mediador ni asume responsabilidad por fraudes o incumplimientos por parte del Organizador.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Propiedad Intelectual</h2>
          <p>Todo el código, diseño y funcionalidades de la plataforma son propiedad exclusiva de Rifas.io y Código Nativo. No se permite la reproducción, distribución o ingeniería inversa sin consentimiento previo.</p>
          
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
    </div>
  );
}
