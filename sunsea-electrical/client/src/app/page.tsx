import type { Metadata } from 'next';
import { makeSeo } from './seo';
import HomeClient from './HomeClient';

export const metadata: Metadata = makeSeo({
  title: 'SunSea Electrical | Premier Electrical Engineering & Installation Services in Kenya',
  description:
    'SunSea Electrical — Kenya\'s trusted electrical engineering partner. We deliver comprehensive power solutions including professional electrical wiring, solar energy installations, generator systems, smart building automation, CCTV & networking, and industrial power systems. Our certified engineers serve Nairobi, Embu, Meru, Nyeri, Tharaka-Nithi, Kirinyaga, Nakuru, Mombasa, Eldoret, Kisumu, Kiambu, Machakos and across Kenya. From substations to solar plants, we power Kenya\'s future with precision engineering and unmatched reliability.',
  canonicalPath: '/',
  keywords: [
    // Primary keywords
    'SunSea Electrical',
    'electrical engineering Kenya',
    'electrical installation Kenya',
    'electrician Nairobi',
    'electrical contractor Kenya',
    
    // Service-specific keywords
    'industrial power systems Kenya',
    'solar energy solutions Kenya',
    'solar panel installation Kenya',
    'generator systems Kenya',
    'smart building systems Kenya',
    'CCTV installation Kenya',
    'network cabling Kenya',
    'electrical maintenance Kenya',
    'MV/LV switchgear Kenya',
    'substation engineering Kenya',
    'backup power solutions Kenya',
    'renewable energy Kenya',
    'power infrastructure Kenya',
    
    // Electrical installation services
    'electrical wiring Kenya',
    'electrical piping Kenya',
    'socket switch installation',
    'consumer unit installation',
    'electrical services Kenya',
    
    // Regional keywords
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
    'electrical contractor Embu',
    'electrical contractor Meru',
    'electrical contractor Nyeri',
  ],
  openGraph: {
    title: 'SunSea Electrical | Trusted Electrical Engineering & Installation in Kenya',
    description:
      'Powering Kenya\'s infrastructure since 2010 with expert electrical engineering, solar installations, generator systems, smart buildings, CCTV, networking, and professional electrical services. Serving Nairobi, Embu, Meru, Nyeri, Tharaka-Nithi, Kirinyaga, Nakuru, Mombasa, Eldoret, Kisumu, Kiambu, Machakos and all of Kenya.',
    url: 'https://sunseaelectrical.vercel.app/',
    images: [
      {
        url: 'https://sunseaelectrical.vercel.app/poster.png',
        width: 1200,
        height: 630,
        alt: 'SunSea Electrical - Premier Electrical Engineering & Installation Services in Kenya',
      },
    ],
  },
  twitter: {
    title: 'SunSea Electrical | Powering Kenya\'s Infrastructure',
    description:
      'Expert electrical engineering, solar solutions, generator systems, smart buildings, CCTV & networking services across Kenya. Trusted since 2010 with certified engineers. Get a free consultation today.',
    images: ['https://sunseaelectrical.vercel.app/poster.png'],
  },
});

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ConstructionBusiness',
  '@id': 'https://sunseaelectrical.vercel.app/#organization',
  name: 'SunSea Electrical',
  description: 'Premier electrical engineering and installation services provider in Kenya since 2010, specializing in industrial power systems, solar energy, generators, smart buildings, and electrical installation.',
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
    { 
      '@type': 'Offer', 
      itemOffered: { 
        '@type': 'Service', 
        name: 'Industrial Power Systems',
        description: 'Design and installation of MV/LV switchgear, substations, and industrial power distribution systems.'
      } 
    },
    { 
      '@type': 'Offer', 
      itemOffered: { 
        '@type': 'Service', 
        name: 'Solar Energy Solutions',
        description: 'Complete solar panel installation, solar PV systems, and renewable energy solutions for homes and businesses.'
      } 
    },
    { 
      '@type': 'Offer', 
      itemOffered: { 
        '@type': 'Service', 
        name: 'Generator Systems',
        description: 'Generator installation, backup power solutions, and emergency power systems.'
      } 
    },
    { 
      '@type': 'Offer', 
      itemOffered: { 
        '@type': 'Service', 
        name: 'Smart Building Systems',
        description: 'Building automation, smart lighting, and energy management systems.'
      } 
    },
    { 
      '@type': 'Offer', 
      itemOffered: { 
        '@type': 'Service', 
        name: 'CCTV & Networking',
        description: 'Professional CCTV installation, network cabling, and security systems.'
      } 
    },
    { 
      '@type': 'Offer', 
      itemOffered: { 
        '@type': 'Service', 
        name: 'Electrical Installation',
        description: 'Professional electrical wiring, piping, socket and switch installation, consumer units, and maintenance.'
      } 
    },
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
        text: 'SunSea Electrical provides professional electrical engineering and installation services across Kenya, including Nairobi, Embu, Meru, Nyeri, Tharaka-Nithi, Kirinyaga, Nakuru, Mombasa, Eldoret, Kisumu, Kiambu, Machakos and all counties nationwide.',
      },
    },
    {
      '@type': 'Question',
      name: 'What electrical services does SunSea Electrical offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer comprehensive electrical services including industrial power systems, solar energy solutions, generator systems, smart building automation, CCTV & networking installation, electrical wiring, piping, sockets, switches, consumer units, and ongoing maintenance services.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is SunSea Electrical a licensed and experienced contractor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. SunSea Electrical has been delivering reliable electrical engineering and power infrastructure solutions across Kenya since 2010. Our certified engineers follow ISO-aligned practices on every project, ensuring safety, quality, and long-term performance.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the cost of electrical installation services in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The cost of electrical installation services varies depending on the scope, size, and complexity of the project. SunSea Electrical provides free consultations and transparent quotations tailored to your specific needs. Contact us for a detailed assessment.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does SunSea Electrical provide solar panel installation in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We specialize in solar energy solutions including solar panel installation, solar PV systems for residential, commercial, and industrial applications. Our renewable energy solutions help reduce electricity costs and promote sustainable power.',
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