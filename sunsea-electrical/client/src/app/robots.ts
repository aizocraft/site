import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
{
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
      {
        userAgent: 'Baiduspider',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
      {
        userAgent: 'YandexBot',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
      {
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
        disallow: ['/dashboard', '/sales', '/admin', '/checkout', '/auth'],
      },
    ],
    sitemap: 'https://sunseaelectrical.vercel.app/sitemap.xml',
    host: 'https://sunseaelectrical.vercel.app',
  }
}
