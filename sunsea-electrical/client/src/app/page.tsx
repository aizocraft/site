import type { Metadata } from 'next';
import { makeSeo } from './seo';
import HomeClient from './HomeClient';

export const metadata: Metadata = makeSeo({
  title: 'SunSea Electrical | Electrical Engineering & Installation in Kenya',
  description:
    'SunSea Electrical — full-service electrical engineering across Kenya since 2010. Industrial power systems, solar energy solutions, generator systems, smart building systems, CCTV & networking, and electrical installation including wiring, piping, sockets, switches, and consumer units. Serving Nairobi, Embu, Meru, Nyeri, Tharaka-Nithi, Kirinyaga, Nakuru, Mombasa, Eldoret, Kisumu, Kiambu, Machakos and across Kenya.',
  canonicalPath: '/',
  keywords: [
    'SunSea Electrical',
    'electrical engineering Kenya',
    'electrical installation Kenya',
    'electrical wiring Kenya',
    'electrical piping Kenya',
    'socket switch installation',
    'consumer unit installation',
    'electrician Nairobi',
    'electrician Embu',
    'electrician Meru',
    'electrician Nyeri',
    'electrician Tharaka-Nithi',
    'electrician Kirinyaga',
    'electrician Nakuru',
    'electrician Mombasa',
    'electrician Eldoret',
    'electrician Kisumu',
    'electrician Kiambu',
    'electrician Machakos',
    'electrical contractor Kenya',
    'industrial power systems',
    'solar energy solutions Kenya',
    'solar panel installation Kenya',
    'generator systems Kenya',
    'smart building systems',
    'CCTV installation Kenya',
    'network cabling Kenya',
    'electrical maintenance Kenya',
    'MV/LV switchgear',
    'substation engineering',
    'backup power solutions Kenya',
    'renewable energy Kenya',
    'electrical services Nairobi',
    'electrical services Embu',
    'electrical services Meru',
    'electrical services Nyeri',
    'electrical services Kirinyaga',
    'electrical services Tharaka-Nithi',
    'electrical services Nakuru',
    'electrical services Mombasa',
    'electrical services Eldoret',
    'electrical services Kisumu',
    'electrical services Kiambu',
    'electrical services Machakos',
    'electrical services Kenya',
    'power infrastructure Kenya',
    'electrical contractor Embu',
    'electrical contractor Meru',
    'electrical contractor Nyeri',
  ],
  openGraph: {
    title: 'SunSea Electrical | Electrical Engineering & Installation in Kenya',
    description:
      'Powering Kenya with reliable electrical engineering since 2010 — substations, solar plants, industrial power, generators, smart buildings, CCTV & networking, and professional electrical installation across Nairobi, Embu, Meru, Nyeri, Tharaka-Nithi, Kirinyaga, Nakuru, Mombasa, Eldoret, Kisumu, Kiambu, Machakos and Kenya.',
    url: 'https://sunseaelectrical.vercel.app/',
    images: [
      {
        url: 'https://sunseaelectrical.vercel.app/poster.png',
        width: 1200,
        height: 630,
        alt: 'SunSea Electrical',
      },
    ],
  },
  twitter: {
    title: 'SunSea Electrical | Electrical Engineering in Kenya',
    description:
      'Industrial power, solar, generators, smart buildings, CCTV & networking, and professional electrical installation across Kenya — get a free consultation from SunSea Electrical.',
    images: ['https://sunseaelectrical.vercel.app/poster.png'],
  },
});

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ConstructionBusiness',
  '@id': 'https://sunseaelectrical.vercel.app/#organization',
  name: 'SunSea Electrical',
  url: 'https://sunseaelectrical.vercel.app/',
  logo: 'https://sunseaelectrical.vercel.app/poster.png',
  image: 'https://sunseaelectrical.vercel.app/poster.png',
  telephone: '+254728749722',
  email: 'sunseaelectrical@gmail.com',
  priceRange: 'KES',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hurlingum Shopping Square, Opposite Total Energies Chokaa, Kangundo Road',
    addressLocality: 'Nairobi',
    addressRegion: 'Nairobi County',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -1.25391636,
    longitude: 36.96117471,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '18:00',
  },
  foundingDate: '2010',
  areaServed: [
    { '@type': 'Place', name: 'Nairobi' },
    { '@type': 'Place', name: 'Embu' },
    { '@type': 'Place', name: 'Meru' },
    { '@type': 'Place', name: 'Nyeri' },
    { '@type': 'Place', name: 'Tharaka-Nithi' },
    { '@type': 'Place', name: 'Kirinyaga' },
    { '@type': 'Place', name: 'Nakuru' },
    { '@type': 'Place', name: 'Mombasa' },
    { '@type': 'Place', name: 'Eldoret' },
    { '@type': 'Place', name: 'Kisumu' },
    { '@type': 'Place', name: 'Kiambu' },
    { '@type': 'Place', name: 'Machakos' },
    { '@type': 'Place', name: 'Kenya' },
  ],
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Industrial Power Systems' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Solar Energy Solutions' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Generator Systems' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Smart Building Systems' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'CCTV & Networking' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Electrical Maintenance' } },
  ],
  sameAs: [
    'https://www.facebook.com/sunseaelectrical',
    'https://www.instagram.com/sunseaelectrical',
    'https://www.linkedin.com/company/sunseaelectrical',
    'https://twitter.com/SunSeaElectrical',
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where does SunSea Electrical provide services in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SunSea Electrical provides electrical engineering and installation services across Kenya, including Nairobi, Embu, Meru, Nyeri, Tharaka-Nithi, Kirinyaga, Nakuru, Mombasa, Eldoret, Kisumu, Kiambu, Machakos and all other counties.',
      },
    },
    {
      '@type': 'Question',
      name: 'What services does SunSea Electrical offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer industrial power systems, solar energy solutions, generator systems, smart building systems, CCTV & networking, electrical maintenance, and complete electrical installation including wiring, piping, sockets, switches, and consumer units.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is SunSea Electrical experienced?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. SunSea Electrical has been delivering reliable electrical engineering and power infrastructure solutions across Kenya since 2010, with ISO-aligned practices and certified engineers on every project.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
