import type { Metadata } from 'next';
import { makeSeo } from '../seo';
import ContactClient from './ContactClient';

export const metadata: Metadata = makeSeo({
  title: 'Contact SunSea Electrical | Electrical Engineering Experts in Kenya',
  description:
    'Contact SunSea Electrical for expert electrical engineering, solar installations, borehole services, and electrical solutions in Kianjokoma, Embu County, and across Kenya. Get a free consultation today.',
  canonicalPath: '/contact',
  keywords: [
    'contact SunSea Electrical',
    'SunSea Electrical contact',
    'electrical engineer Kianjokoma',
    'solar installation Embu',
    'borehole services Embu',
    'electrical contractor Kenya',
    'pamenji2017@gmail.com',
    'electrical engineering Embu',
    'solar solutions Kenya',
    'electrical installation Kenya',
    'electrical services Kenya',
    'Peter Maina',
    'electrical engineer Kenya',
    'electrical engineer Nairobi',
    'electrical engineer Embu',
    'electrical engineer Meru',
    'electrical engineer Nyeri',
    'electrical engineer Tharaka-Nithi',
    'electrical engineer Kirinyaga',
    'electrical engineer Nakuru',
    'electrical engineer Mombasa',
    'electrical engineer Eldoret',
    'electrical engineer Kisumu',
    'electrical engineer Kiambu',
    'electrical engineer Machakos',
    'electrical engineer Kangundo Road',
    'electrical engineer Hurlingham Nairobi',
    'electrical services',
    'electrical installation',
    'electrical piping',
    'electrical wiring',
    'electrical maintenance',
    'electrical contractor',
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
  ],
  openGraph: {
    title: 'Contact SunSea Electrical | Free Consultation',
    description:
      'Get in touch with SunSea Electrical for expert electrical engineering, solar, borehole, and electrical services in Embu and across Kenya.',
    url: 'https://sunseaelectrical.vercel.app/contact',
    images: [
      {
        url: '/poster.png',
        width: 1200,
        height: 630,
        alt: 'SunSea Electrical - Electrical Engineering Experts',
      },
    ],
  },
  twitter: {
    title: 'Contact SunSea Electrical',
    description:
      'Expert electrical engineering, solar installations, and borehole services in Embu, Kenya.',
    images: ['/poster.png'],
  },
});

export default function ContactPage() {
  return <ContactClient />;
}