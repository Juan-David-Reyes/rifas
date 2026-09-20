import { createClient } from '../utils/supabase/server'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://debuenas.co'

  // Rutas estáticas principales
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/crear-rifa`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  try {
    const supabase = await createClient()

    // Obtener solo las rifas activas
    const { data: raffles, error } = await supabase
      .from('raffles')
      .select('slug, created_at')
      .eq('status', 'ACTIVE')

    if (!error && raffles) {
      const dynamicRoutes = raffles.map((raffle) => ({
        url: `${baseUrl}/${raffle.slug}`,
        lastModified: new Date(raffle.created_at),
        changeFrequency: 'daily',
        priority: 0.9,
      }))
      
      return [...routes, ...dynamicRoutes]
    }
  } catch (err) {
    console.error("Error generando sitemap dinámico:", err)
  }

  return routes
}
