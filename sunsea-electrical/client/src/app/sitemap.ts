import type { MetadataRoute } from 'next'

const BASE_URL = 'https://sunseaelectrical.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Main static routes with optimized priorities
  const staticRoutes = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.9 },
    { path: '/services', changeFrequency: 'weekly' as const, priority: 0.95 },
    { path: '/products', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/projects', changeFrequency: 'weekly' as const, priority: 0.85 },
    { path: '/gallery', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.85 },
    { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
  ]

  const routes: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  return routes
}