import Link from 'next/link';
import { Ticket, Users, Zap, ShieldCheck, ArrowRight, Share2, DollarSign } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden pt-20 pb-24 md:pt-32 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-50 via-white to-white -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 font-semibold text-sm mb-8 border border-green-100">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Plataforma 100% autogestionable
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 font-heading mb-8 leading-tight tracking-tight">
            Crea tu rifa en línea <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-green-400">
              en menos de 5 minutos
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-medium">
            La forma más fácil y segura de organizar sorteos, recaudar fondos para causas solidarias y gestionar participantes. Sin comisiones ocultas.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link href="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-green-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
              Empezar mi Rifa Gratis <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#como-funciona" className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-center">
              Ver cómo funciona
            </a>
          </div>

          {/* Hero Image Mockup */}
          <div className="mt-20 relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-full w-full"></div>
            <div className="rounded-3xl border border-gray-200 bg-white p-2 shadow-2xl relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 flex items-center justify-center min-h-[300px]">
                <div className="text-center space-y-4">
                  <div className="flex justify-center gap-2 mb-6">
                    {[1,2,3].map(i => (
                      <div key={i} className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl ${i===2 ? 'bg-primary-600 text-white shadow-lg scale-110' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                        {i === 1 ? '01' : i === 2 ? '02' : '03'}
                      </div>
                    ))}
                  </div>
                  <h3 className="font-heading text-2xl text-gray-800">Visualiza tu grilla interactiva</h3>
                  <p className="text-gray-500">Tus clientes eligen y pagan directamente.</p>
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
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Olvídate de las listas de papel y los mensajes enredados por WhatsApp. Rifas.io automatiza todo el proceso.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Ticket className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Página Web Única</h3>
              <p className="text-gray-600">Cada rifa obtiene un enlace personalizado (ej. rifas.io/mi-sorteo) que puedes compartir en tus redes sociales.</p>
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
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-900 text-white font-bold rounded-full flex items-center justify-center text-xl">1</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Crea tu cuenta y tu rifa</h4>
                    <p className="text-gray-600">Ponle un título, define el premio, el valor de cada número y el sistema generará tu grilla al instante.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-900 text-white font-bold rounded-full flex items-center justify-center text-xl">2</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Comparte el enlace</h4>
                    <p className="text-gray-600">Pega el link de tu rifa en WhatsApp, Instagram o Facebook. Tus compradores entrarán directamente.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white font-bold rounded-full flex items-center justify-center text-xl shadow-lg shadow-green-200">3</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Recibe el dinero</h4>
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

      {/* CTA Section */}
      <section className="bg-gray-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary-600 rounded-full blur-3xl opacity-20"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-black text-white font-heading mb-6">¿Listo para hacer tu primer sorteo?</h2>
          <p className="text-gray-300 text-lg mb-10">Únete a cientos de organizadores que ya han modernizado la forma de recaudar fondos y hacer rifas.</p>
          <Link href="/login" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl transition-all transform hover:scale-105">
            Crear mi Rifa Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
