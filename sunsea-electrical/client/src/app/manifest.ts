import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SunSea Electrical — Electrical Engineering & Power Solutions in Kenya',
    short_name: 'SunSea',
    description:
      'Full-service electrical engineering company in Kenya since 2010. Industrial power systems, solar energy, generators, smart buildings, CCTV & networking, and professional electrical installation.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0089d1',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/poster.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    orientation: 'portrait-primary',
    lang: 'en',
    categories: ['electrical', 'engineering', 'energy', 'solar', 'business'],
    scope: '/',
    related_applications: [],
  }
}