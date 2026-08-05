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
    'SunSea Electrical — full-service electrical engineering company in Kenya since 2010. Industrial power systems, solar energy solutions, generator systems, smart building systems, CCTV & networking, and professional electrical installation (wiring, piping, sockets, switches, consumer units). Serving Nairobi, Embu, Meru, Nyeri, Tharaka-Nithi, Kirinyaga, Nakuru, Mombasa, Eldoret, Kisumu, Kiambu, Machakos and across Kenya.',
  applicationName: COMPANY.name,
  authors: [{ name: COMPANY.name, url: COMPANY.url }],
  creator: COMPANY.name,
  publisher: COMPANY.name,
  category: 'Electrical Engineering',
  keywords: [
    'SunSea Electrical',
    'electrical engineering Kenya',
    'electrical installation Kenya',
    'electrical wiring Kenya',
    'electrical contractor Nairobi',
    'electrician Embu',
    'electrician Meru',
    'electrician Nyeri',
    'electrician Kirinyaga',
    'electrician Tharaka-Nithi',
    'electrician Nakuru',
    'electrician Mombasa',
    'electrician Eldoret',
    'electrician Kisumu',
    'electrician Kiambu',
    'electrician Machakos',
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
    'power infrastructure Kenya',
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
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address,
    addressLocality: 'Nairobi',
    addressRegion: 'Nairobi County',
    addressCountry: 'KE',
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
