import type { MetadataRoute } from 'next'

const BASE_URL = 'https://sunseaelectrical.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.9 },
    { path: '/services', changeFrequency: 'weekly' as const, priority: 0.95 },
    { path: '/products', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/categories', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/projects', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/gallery', changeFrequency: 'weekly' as const, priority: 0.85 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.9 },
    { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
  ]

  // Core service routes
  const serviceRoutes = [
    '/solar-solutions',
    '/solar-home-systems',
    '/solar-commercial-systems',
    '/solar-water-heaters',
    '/solar-water-pumps',
    '/solar-backup-systems',
    '/borehole-services',
    '/hydro-geological-survey',
    '/environmental-impact-assessment',
    '/borehole-drilling',
    '/submersible-pumps',
    '/borehole-rehabilitation',
    '/water-towers',
    '/elevated-steel-tanks',
    '/elevated-pvc-tanks',
  ]

  const routes: MetadataRoute.Sitemap = [
    ...staticRoutes.map((r) => ({
      url: `${BASE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...serviceRoutes.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]

  return routes
}
