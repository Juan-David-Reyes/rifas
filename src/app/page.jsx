import Link from 'next/link';
import { Ticket, Users, Zap, ShieldCheck, ArrowRight, Share2, DollarSign } from 'lucide-react';
import FaqAccordion from '../components/FaqAccordion';
import { getSiteSettings } from '../utils/settingsActions';

// Forzar actualización dinámica si se cambia la db
export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const settings = await getSiteSettings()
  
  const heroTitle = settings?.hero_title || 'Crea tu Rifa Virtual en 5 Minutos'
  const heroSubtitle = settings?.hero_subtitle || 'Organiza sorteos y recauda fondos de forma 100% automatizada. Sin mensualidades ni comisiones por ventas, el dinero va directo a tu cuenta.'
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Modern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary-400 opacity-20 blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            
            {/* Left Column: Copy & CTAs */}
            <div className="flex-1 text-center lg:text-left pt-10 lg:pt-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50/50 text-primary-700 font-semibold text-sm mb-6 border border-primary-100 shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                La nueva forma de gestionar sorteos
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 font-heading mb-6 leading-tight tracking-tight">
                {heroTitle.split(' en ').length > 1 ? (
                  <>
                    {heroTitle.split(' en ')[0]} <br className="hidden lg:block"/> 
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-green-400">
                      en {heroTitle.split(' en ')[1]}
                    </span>
                  </>
                ) : (
                  heroTitle
                )}
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                {heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link href="/crear-rifa" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-primary-200/50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                  Empezar Gratis <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#como-funciona" className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-center shadow-sm">
                  Ver cómo funciona
                </a>
              </div>

              {/* Pricing Disclaimer */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 text-sm text-gray-600 font-medium bg-gray-50/80 p-3 rounded-xl border border-gray-100 w-fit mx-auto lg:mx-0 backdrop-blur-sm">
                <div className="bg-green-100 text-green-700 p-1.5 rounded-lg">
                  <DollarSign className="w-4 h-4" />
                </div>
                <p>
                  <strong>Único pago:</strong>{' '}
                  {settings?.fee_type === 'fixed' ? (
                    <>
                      ${(settings?.fee_fixed || 20000).toLocaleString('es-CO')} COP por rifa creada.
                    </>
                  ) : (
                    <>
                      El valor de 1 boleta de tu rifa <span className="text-gray-400 font-normal">(Mín. $10.000 COP)</span>.
                    </>
                  )}
                </p>
              </div>
              
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 font-medium">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                  ))}
                </div>
                <p>+500 organizadores confían en nosotros</p>
              </div>
            </div>

            {/* Right Column: Floating UI Mockup */}
            <div className="flex-1 w-full flex justify-center lg:justify-end relative mt-8 lg:mt-0">
              <div className="w-full max-w-md relative">
                <div className="absolute inset-0 bg-linear-to-tr from-primary-100/40 to-green-50/40 rounded-[32px] transform rotate-3 scale-105 -z-10"></div>
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-5 md:p-6 transform transition-transform hover:-translate-y-2 duration-500">
                {/* Mockup Header */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Gran Rifa Solidaria</h3>
                    <p className="text-sm text-green-600 font-medium">Premio: $500.000</p>
                  </div>
                  <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                    $10.000 / número
                  </div>
                </div>
                
                {/* Mockup Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {[...Array(15)].map((_, i) => {
                    let statusClass = "bg-white border-2 border-gray-200 text-gray-700";
                    let content = String(i + 1).padStart(2, '0');
                    
                    if (i === 2 || i === 7) {
                      statusClass = "bg-gray-200 border-gray-300 text-gray-400";
                    } else if (i === 4) {
                      statusClass = "bg-yellow-100 border-yellow-300 text-yellow-700";
                    } else if (i === 12) {
                      statusClass = "bg-primary-600 border-primary-600 text-white shadow-md transform scale-105";
                    }
                    
                    return (
                      <div key={i} className={`aspect-square rounded-xl flex items-center justify-center font-bold text-xs md:text-sm ${statusClass}`}>
                        {content}
                      </div>
                    )
                  })}
                </div>
                
                {/* Mockup Footer */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 animate-pulse"></span>
                    <span className="text-sm text-gray-600 font-medium">85 disponibles</span>
                  </div>
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
                    Comprar
                  </button>
                </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50" id="beneficios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 font-heading mb-4">Todo lo que necesitas para tu sorteo</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Olvídate de las listas de papel y los mensajes enredados por WhatsApp. deBuenas automatiza todo el proceso.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Ticket className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Página Web Única</h3>
              <p className="text-gray-600">Cada rifa obtiene un enlace personalizado (ej. debuenas.co/mi-sorteo) que puedes compartir en tus redes sociales.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reservas en Tiempo Real</h3>
              <p className="text-gray-600">Sistema de concurrencia que evita que dos personas compren el mismo número. Si no pagan en 15 minutos, se libera.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Panel Administrativo</h3>
              <p className="text-gray-600">Lleva el control exacto de quién pagó, cuánto has recaudado y a quién le faltan números por abonar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white" id="como-funciona">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 font-heading mb-6">¿Cómo funciona?</h2>
              
              <div className="space-y-8 mt-10">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-gray-900 text-white font-bold rounded-full flex items-center justify-center text-xl">1</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Crea tu cuenta y tu rifa</h3>
                    <p className="text-gray-600">Ponle un título, define el premio, el valor de cada número y el sistema generará tu grilla al instante.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-gray-900 text-white font-bold rounded-full flex items-center justify-center text-xl">2</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Comparte el enlace</h3>
                    <p className="text-gray-600">Pega el link de tu rifa en WhatsApp, Instagram o Facebook. Tus compradores entrarán directamente.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-primary-600 text-white font-bold rounded-full flex items-center justify-center text-xl shadow-lg shadow-green-200">3</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Recibe el dinero</h3>
                    <p className="text-gray-600">Ellos eligen su número y te envían el comprobante de pago directo a tu WhatsApp. Tú solo apruebas el pago en el sistema.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 bg-gray-100 rounded-3xl p-8 relative">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-10 w-full bg-blue-50 rounded-lg flex items-center px-4">
                     <div className="h-3 w-40 bg-blue-200 rounded"></div>
                  </div>
                  <div className="h-10 w-full bg-green-50 rounded-lg flex items-center px-4">
                     <div className="h-3 w-48 bg-green-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 bg-gray-50" id="faqs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 font-heading mb-4">Preguntas frecuentes</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Todo lo que necesitas saber antes de crear tu primer sorteo.</p>
          </div>
          
          <FaqAccordion />
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-14 relative overflow-hidden">
        <div className="bg-gray-900 rounded-4xl max-w-7xl mx-auto px-4 py-16 text-center relative z-10">
          <h2 className="text-4xl font-black text-white font-heading mb-6">¿Listo para hacer tu primer sorteo?</h2>
          <p className="text-gray-300 text-lg mb-10">Únete a cientos de organizadores que ya han modernizado la forma de recaudar fondos y hacer rifas.</p>
          <Link href="/crear-rifa" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl transition-all transform hover:scale-105">
            Crear mi Rifa Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
