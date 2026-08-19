import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Disallow paths that shouldn't be crawled
  const disallowPaths = [
    '/dashboard',
    '/dashboard/*',
    '/sales',
    '/sales/*',
    '/admin',
    '/admin/*',
    '/checkout',
    '/auth',
    '/auth/*',
    '/api',
    '/api/*',
    '/cart',
    '/cart/*',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowPaths,
      },
      // AI crawlers - optionally block completely
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ClaudeBot',
        disallow: ['/'],
      },
      {
        userAgent: 'PerplexityBot',
        disallow: ['/'],
      },
      {
        userAgent: 'Google-Extended',
        disallow: ['/'],
      },
    ],
    sitemap: 'https://sunseaelectrical.vercel.app/sitemap.xml',
    host: 'https://sunseaelectrical.vercel.app',
  }
}