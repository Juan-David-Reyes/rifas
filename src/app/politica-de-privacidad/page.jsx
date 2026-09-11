export const metadata = {
  title: 'Política de Privacidad y Uso Aceptable | Rifas.io',
  description: 'Cómo tratamos tus datos y reglas de uso en Rifas.io',
};

export default function PrivacidadPage() {
  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 font-heading mb-8">Política de Privacidad y Uso Aceptable</h1>
        
        <div className="prose prose-gray max-w-none text-gray-600 space-y-6 leading-relaxed">
          <p className="font-medium text-gray-800">Última actualización: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Recopilación de Información</h2>
          <p>Recopilamos información que proporcionas directamente (como nombre de usuario, correo electrónico e información de autenticación mediante proveedores de identidad como Supabase/Google) y datos que se generan al usar nuestra plataforma.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Uso de los Datos</h2>
          <p>Utilizamos tu información personal exclusivamente para operar y mantener el Servicio, autenticar tu acceso, mejorar la seguridad y comunicarnos contigo respecto a cambios importantes. <strong>No vendemos ni alquilamos tus datos personales a terceros.</strong></p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Seguridad de la Información</h2>
          <p>Aplicamos medidas técnicas y organizativas para proteger tus datos. Utilizamos proveedores de primer nivel (como Supabase y Vercel) que cumplen con estándares internacionales de seguridad. Sin embargo, ningún sistema es 100% invulnerable.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Política de Uso Aceptable</h2>
          <p>Al utilizar nuestra plataforma, te comprometes a no usarla para actividades ilegales, fraudulentas o que infrinjan los derechos de terceros. Nos reservamos el derecho de suspender o eliminar inmediatamente cuentas que organicen sorteos con indicios de estafa (scam) o que incumplan con la normativa legal de su país.</p>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-2xl my-8 flex flex-col md:flex-row gap-4 items-start shadow-sm">
            <div className="shrink-0 bg-red-100 p-2 rounded-full text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <div>
              <h3 className="text-red-900 font-bold text-lg mb-2">Advertencia Legal: Prohibición de Juegos de Azar no Autorizados</h3>
              <p className="text-red-800 leading-relaxed text-sm md:text-base">
                Está <strong>expresamente prohibido</strong> usar Hazturifa para operar juegos de azar, apuestas, casinos, bingo, loterías o cualquier mecánica de azar con dinero real en jurisdicciones donde esa actividad no esté permitida por la ley, o para las cuales el Organizador no posea los permisos gubernamentales correspondientes.
              </p>
              <p className="text-red-800 leading-relaxed text-sm md:text-base mt-2 font-medium">
                Hazturifa es un software tecnológico (SaaS) creado para la autogestión logística de rifas promocionales, entre amigos o causas solidarias — no es una casa de apuestas.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Derechos ARCO</h2>
          <p>Tienes derecho a acceder, rectificar, cancelar y oponerte al tratamiento de tus datos personales. Puedes solicitar la eliminación de tu cuenta y datos asociados en cualquier momento contactando a nuestro soporte.</p>
        </div>
      </div>
    </div>
  );
}
