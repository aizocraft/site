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
    'power infrastructure Kenya',
    'electrical contracting company Kenya',
    'electrical services Nairobi',
    'electrical services Embu',
    'electrical services Meru',
    'electrical services Nyeri',
    'electrical services Tharaka-Nithi',
    'electrical services Kirinyaga',
    'electrical services Nakuru',
    'electrical services Mombasa',
    'electrical services Eldoret',
    'electrical services Kisumu',
    'electrical services Kiambu',
    'electrical services Machakos',
    'electrical services Kangundo Road',
    'electrical services Hurlingham Nairobi',
    'electrical services',
    'electrical installation',
    'electrical piping',
    'electrical wiring',
    'electrical contractor Kenya',
    'electrical contractor Nairobi',
    'electrical contractor Embu',
    'electrical contractor Meru',
    'electrical contractor Nyeri',
    'electrical contractor Tharaka-Nithi',
    'electrical contractor Kirinyaga',
    'electrical contractor Nakuru',
    'electrical contractor Mombasa',
    'electrical contractor Eldoret',
    'electrical contractor Kisumu',
    'electrical contractor Kiambu',
    'electrical contractor Machakos',
    'electrical contractor Kangundo Road',
    'electrical contractor Hurlingham Nairobi',
    'cctv installation Kenya',
    'network cabling Kenya',
    'MV/LV switchgear Kenya',
    'analog and digital control systems Kenya',
    'substation engineering Kenya',
    'backup power solutions Kenya',
    'renewable energy Kenya',
    'power infrastructure Kenya',
    'electrical contracting company Kenya',
    'electrical services Nairobi',
    'electrical services in Embu',
    'electrical services in Meru',
    'electrical services in Nyeri',
    'electrical services in Tharaka-Nithi',
    'electrical services in Kirinyaga',
    'electrical services in Nakuru',
    'electrical services in Mombasa',
    'electrical services in Eldoret',
    'electrical services in Kisumu',
    'electrical services in Kiambu',
    'electrical services in Machakos',
    'electrical services in Kangundo Road',
    'electrical services in Hurlingham Nairobi',
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
  // Define the function that will be passed to Hero
  const handleOpenProfile = () => {
    // Your profile opening logic here
    // For example, open a modal, navigate to a page, etc.
    console.log('Profile opened');
  };

  return <About />;
}