import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, unit_price, raffle_id, origin } = body;

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN no configurado en el servidor.');
    }

    // Configurar cliente MP
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: { timeout: 5000 }
    });

    const preference = new Preference(client);

    let baseUrl = origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://debuenas.co';
    
    // MercadoPago rechaza URLs de localhost para auto_return
    if (baseUrl.includes('localhost')) {
      baseUrl = 'https://debuenas.co';
    }

    // Crear la preferencia
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'raffle_activation',
            title: title || 'Activación de Rifa - deBuenas',
            quantity: 1,
            unit_price: Number(unit_price) || 10000,
            currency_id: 'COP',
            description: 'Pago por activación de plataforma deBuenas',
          }
        ],
        back_urls: {
          success: `${baseUrl}/checkout/success?raffle_id=${raffle_id}`,
          pending: `${baseUrl}/checkout/success?raffle_id=${raffle_id}&status=pending`,
          failure: `${baseUrl}/dashboard/create?error=payment_failed`, // En caso de fallo volvemos al panel
        },
        auto_return: 'approved',
        external_reference: String(raffle_id), // Muy importante para los Webhooks
        metadata: {
          raffle_id: String(raffle_id)
        }
      }
    });

    return NextResponse.json({ 
      id: result.id, 
      init_point: result.init_point, 
      sandbox_init_point: result.sandbox_init_point 
    });

  } catch (error) {
    console.error("MercadoPago Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
