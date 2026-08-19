// app/about/page.tsx
import type { Metadata } from 'next'
import About from './About'
import { makeSeo } from '../seo'

export const metadata: Metadata = makeSeo({
  title: 'About SunSea Electrical | Electrical Engineering Experts in Kenya',
  description:
    'Learn about SunSea Electrical—your trusted provider of industrial power systems, solar energy solutions, generators, smart building systems, and maintenance across Kenya. Built for reliability, safety, and long-term performance.',
  canonicalPath: '/about',
  keywords: [
    'SunSea Electrical',
    'about SunSea Electrical',
    'electrical engineering Kenya',
    'solar installation Kenya',
    'generator systems',
    'smart building systems',
    'electrical maintenance Kenya',
    'renewable energy Kenya',
  ],
  openGraph: {
    title: 'About SunSea Electrical | Electrical Engineering Experts',
    description:
      'We deliver safe, efficient, and future-ready power solutions across Kenya—from consultation to installation and support.',
url: 'https://sunseaelectrical.vercel.app/about',
    images: [{ url: '/poster.png', width: 1200, height: 630, alt: 'SunSea Electrical' }],
  },
  twitter: {
    title: 'About SunSea Electrical',
    description:
      'Electrical engineering, solar, generators, and smart buildings in Kenya—trusted solutions from SunSea Electrical.',
    images: ['/poster.png'],
  },
})

export default function AboutPage() {
  return <About />;
}
