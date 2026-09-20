import { createClient } from '../../../utils/supabase/server';
import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function CheckoutSuccessPage({ searchParams }) {
  const { raffle_id, status } = await searchParams;

  if (!raffle_id) {
    redirect('/dashboard');
  }

  const supabase = await createClient();

  if (status === 'approved' || !status) {
    // Si viene de success, asumiendo approved o sin status es success en nuestro back_urls
    // En producción real esto debería validarse por Webhook para máxima seguridad,
    // pero actualizaremos optimísticamente aquí.
    const { error } = await supabase
      .from('raffles')
      .update({ status: 'ACTIVE' })
      .eq('id', raffle_id);

    if (error) {
      console.error('Error updating raffle status:', error);
    }
  }

  const isSuccess = status === 'approved' || !status;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-gray-100">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isSuccess ? 'bg-green-100' : 'bg-orange-100'}`}>
          {isSuccess ? (
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          ) : (
            <XCircle className="w-12 h-12 text-orange-500" />
          )}
        </div>
        
        <h2 className="text-3xl font-black font-heading text-gray-900 mb-4">
          {isSuccess ? '¡Pago Exitoso!' : 'Pago Pendiente o Fallido'}
        </h2>
        
        <p className="text-gray-500 font-medium mb-10">
          {isSuccess 
            ? 'Tu pago ha sido procesado correctamente. Tu rifa ya está activa y lista para recibir a tus compradores.' 
            : 'Tu pago está en proceso de validación o fue rechazado. Revisa el estado desde tu panel.'}
        </p>
        
        <Link 
          href="/dashboard" 
          className="inline-block w-full bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all transform hover:-translate-y-1"
        >
          Ir a mi Dashboard de Control
        </Link>
      </div>
    </div>
  );
}
