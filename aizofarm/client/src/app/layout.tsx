// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from './ClientLayout'

const inter = Inter({ subsets: ['latin'] })

const COMPANY = {
  name: 'SunSea Electrical',
  url: 'https://sunseaelectrical.vercel.app',
  phone: '+254 728 749 722',
  email: 'sunseaelectrical@gmail.com',
  address: 'Hurlingum Shopping Square, Opposite Total Energies Chokaa, Kangundo Road, Nairobi',
  founded: '2010',
}

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.url),
  title: {
    default: 'SunSea Electrical | Electrical Engineering & Power Solutions in Kenya',
    template: '%s | SunSea Electrical',
  },
description:
    'SunSea Electrical — full-service electrical engineering and construction company in Kenya since 2010. Led by David Munene, we deliver industrial power systems, solar energy solutions, generator systems, borehole drilling & water solutions, smart building systems, CCTV & networking, and professional electrical installation (wiring, piping, sockets, switches, consumer units). Serving Nairobi, Embu, Meru, Nyeri, Tharaka-Nithi, Kirinyaga, Nakuru, Mombasa, Eldoret, Kisumu, Kiambu, Machakos and across Kenya.',
  applicationName: COMPANY.name,
  authors: [{ name: 'David Munene', url: COMPANY.url }, { name: COMPANY.name, url: COMPANY.url }],
  creator: 'David Munene',
  publisher: COMPANY.name,
  category: 'Electrical Engineering & Construction',
  keywords: [
    'SunSea Electrical',
    'SunSea Electrical company',
    'SunSea Electrical Kenya',
    'David Munene',
    'David Munene electrical',
    'David Munene contractor',
    'David Munene Kenya',
    'SunSea Electrical David Munene',
    'electrical engineering Kenya',
    'electrical installation Kenya',
    'electrical wiring Kenya',
    'electrical contractor Kenya',
    'electrical contractor Nairobi',
    'electrician Nairobi',
    'electrician Embu',
    'electrician Meru',
    'electrician Nyeri',
    'electrician Kirinyaga',
    'electrician Tharaka-Nithi',
    'electrician Muranga',
    'electrician Nakuru',
    'electrician Mombasa',
    'electrician Eldoret',
    'electrician Kisumu',
    'electrician Kiambu',
    'electrician Machakos',
    'electrician Kangundo Road',
    'electrician Hurlingham Nairobi',
    'electrical company Kenya',
    'electrical company Nairobi',
    'construction company Kenya',
    'construction company Nairobi',
    'electrical construction Kenya',
    'industrial power systems',
    'industrial electrician Kenya',
    'power distribution Kenya',
    'solar energy solutions Kenya',
    'solar panel installation Kenya',
    'solar system installers Kenya',
    'solar company Kenya',
    'solar company Nairobi',
    'solar water heaters Kenya',
    'solar water pumping Kenya',
    'solar installers Embu',
    'solar installers Meru',
    'generator systems Kenya',
    'generator installation Kenya',
    'backup generator Kenya',
    'borehole drilling Kenya',
    'borehole drilling Nairobi',
    'borehole drilling Embu',
    'borehole drilling Meru',
    'borehole drilling machakos',
    'borehole water pump installation',
    'hydro geological survey Kenya',
    'water tower construction Kenya',
    'water tank installation Kenya',
    'elevated water tank Kenya',
    'smart building systems',
    'CCTV installation Kenya',
    'CCTV company Nairobi',
    'network cabling Kenya',
    'structured cabling Kenya',
    'electrical maintenance Kenya',
    'MV/LV switchgear',
    'substation engineering',
    'power infrastructure Kenya',
    'backup power solutions Kenya',
    'renewable energy Kenya',
    'energy solutions Kenya',
    'electrical products Kenya',
    'electrical equipment supplier Kenya',
    'electrical shop Nairobi',
    'power transformers Kenya',
    'electrical contracting company Kenya',
    'best electrician in Kenya',
    'electrical services Nairobi',
    'electrical services Embu',
    'electrical services Meru',
    '24 hour electrician Kenya',
  ],
  alternates: {
    canonical: COMPANY.url,
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: COMPANY.url,
    siteName: COMPANY.name,
    title: 'SunSea Electrical | Electrical Engineering & Power Solutions in Kenya',
    description:
      'Powering Kenya with reliable electrical engineering since 2010 — industrial power systems, solar energy, generators, smart buildings, CCTV & networking, and professional electrical installation across Nairobi, Embu, Meru, Nyeri, Tharaka-Nithi, Kirinyaga and Kenya.',
    images: [
      {
        url: `${COMPANY.url}/poster.png`,
        width: 1200,
        height: 630,
        alt: 'SunSea Electrical',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SunSea Electrical | Electrical Engineering & Power Solutions',
    description:
      'Industrial power, solar, generators, smart buildings, CCTV & networking, and professional electrical installation across Kenya — get a free consultation from SunSea Electrical.',
    images: [`${COMPANY.url}/poster.png`],
    site: '@SunSeaElectrical',
    creator: '@SunSeaElectrical',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: 'google-site-verification-placeholder',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ConstructionBusiness',
  name: COMPANY.name,
  url: COMPANY.url,
  logo: `${COMPANY.url}/poster.png`,
  image: `${COMPANY.url}/poster.png`,
description: metadata.description,
  telephone: COMPANY.phone,
  email: COMPANY.email,
  founder: {
    '@type': 'Person',
    name: 'David Munene',
    jobTitle: 'Founder & Lead Engineer',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address,
    addressLocality: 'Nairobi',
    addressRegion: 'Nairobi County',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -1.2921,
    longitude: 36.8219,
  },
  foundingDate: COMPANY.founded,
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
  sameAs: [
    'https://www.facebook.com/sunseaelectrical',
    'https://www.instagram.com/sunseaelectrical',
    'https://www.linkedin.com/company/sunseaelectrical',
    'https://twitter.com/SunSeaElectrical',
  ],
  knowsAbout: [
    'Industrial Power Systems',
    'Solar Energy Solutions',
    'Generator Systems',
    'Smart Building Systems',
    'CCTV & Networking',
    'Electrical Maintenance',
    'Electrical Wiring',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
