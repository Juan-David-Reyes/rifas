import { ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="px-6 text-gray-700 py-4 text-center text-xs mt-auto">
      <div className='max-w-7xl mx-auto'>
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-1">
            <Link href="/" className="font-heading text-2xl font-extrabold text-primary-600 mb-2">
              deBuenas
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              La plataforma definitiva para crear y gestionar rifas solidarias, sorteos y loterías de forma rápida y segura en toda Latinoamérica.
            </p>
          </div>
          
          {/* Column 2: Platform */}
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-gray-900 text-sm mb-2">Plataforma</h3>
            <Link href="/" className="text-gray-500 hover:text-primary-600 hover:underline text-sm transition-colors">Inicio</Link>
            <Link href="/#como-funciona" className="text-gray-500 hover:text-primary-600 hover:underline text-sm transition-colors">Cómo funciona</Link>
            <Link href="/#beneficios" className="text-gray-500 hover:text-primary-600 hover:underline text-sm transition-colors">Beneficios</Link>
            <Link href="/#faqs" className="text-gray-500 hover:text-primary-600 hover:underline text-sm transition-colors">Preguntas Frecuentes</Link>
          </div>

          {/* Column 3: Organizers */}
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-gray-900 text-sm mb-2">Organizadores</h3>
            <Link href="/crear-rifa" className="text-gray-500 hover:text-primary-600 hover:underline text-sm transition-colors">Crear mi rifa</Link>
            <Link href="/login" className="text-gray-500 hover:text-primary-600 hover:underline text-sm transition-colors">Iniciar sesión</Link>
            <Link href="/dashboard" className="text-gray-500 hover:text-primary-600 hover:underline text-sm transition-colors">Panel de control</Link>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-gray-900 text-sm mb-2">Legal</h3>
            <Link href="/terminos-y-condiciones" className="text-gray-500 hover:text-primary-600 hover:underline text-sm transition-colors">Términos y Condiciones</Link>
            <Link href="/politica-de-privacidad" className="text-gray-500 hover:text-primary-600 hover:underline text-sm transition-colors">Política de Privacidad</Link>
            <Link href="/politica-de-cookies" className="text-gray-500 hover:text-primary-600 hover:underline text-sm transition-colors">Política de Cookies</Link>
          </div>
        </div>

        <div className="pt-0"></div>
        <p className='text-left mb-6 mt-8'><b>Aviso de Exención de Responsabilidad:</b> deBuenas es exclusivamente una herramienta tecnológica de software (SaaS) para la autogestión de rifas. No organizamos, patrocinamos ni operamos sorteos; no emitimos ni vendemos boletos directamente a los participantes, no custodiamos fondos de terceros y no entregamos premios. La legalidad del sorteo, la obtención de los permisos gubernamentales correspondientes en su país (como la autorización municipal o de entidades nacionales de juegos de azar) y la entrega final de los premios son de responsabilidad única y exclusiva de cada organizador. Al utilizar nuestro servicio, el organizador acepta cumplir con los <a href="/terminos-y-condiciones" className='text-primary-600 hover:underline font-semibold'>Términos y condiciones</a>, la <a href="/politica-de-privacidad" className='text-primary-600 hover:underline font-semibold'>Política de privacidad y uso aceptable</a> y la <a href="/politica-de-cookies" className='text-primary-600 hover:underline font-semibold'>Política de cookies</a>.
        </p>
        
        <div className='flex flex-col lg:flex-row justify-between items-center gap-6 pb-6'>
          <div className="flex flex-col items-center lg:items-start gap-1">
            <p><b>© {new Date().getFullYear()} debuenas.co</b>. Todos los derechos reservados. Hecho para organizadores de toda Latinoamérica</p>
            <p>Diseño y desarrollo por <a href="https://codigonativo.com/" className="text-primary-600 hover:underline font-bold" target="_blank" rel="noopener noreferrer">Código Nativo</a></p>
          </div>

          <div className="bg-primary-50 border border-primary-100 px-6 py-2 flex items-center justify-center flex-wrap gap-4" style={{ borderRadius: '8px' }}>
            <div className="flex items-center gap-2 text-primary-900 font-bold">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span className="text-sm">Pago 100% seguro</span>
            </div>
            <div className="flex items-center gap-4">
              <Image src="/images/logo-mercado-pago.svg" alt="Mercado Pago" width={60} height={20} className="h-5 w-auto" />
              <Image src="/images/logo-visa.svg" alt="Visa" width={40} height={16} className="h-4 w-auto" />
              <Image src="/images/Mastercard-logo.svg" alt="Mastercard" width={40} height={20} className="h-5 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
