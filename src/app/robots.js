export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://debuenas.co'

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/crear-rifa'],
      disallow: ['/dashboard/', '/admin/', '/checkout/', '/auth/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
