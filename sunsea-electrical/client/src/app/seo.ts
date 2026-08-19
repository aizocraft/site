import type { Metadata } from 'next'

const BASE_URL = 'https://sunseaelectrical.vercel.app'
const DEFAULT_OG_IMAGE = '/poster.png'

type SeoParams = {
  title: string
  description: string
  canonicalPath?: string
  openGraph?: Partial<NonNullable<Metadata['openGraph']>>
  twitter?: Partial<NonNullable<Metadata['twitter']>>
  keywords?: string[]
}

function toCommaSeparated(keywords?: string[]) {
  if (!keywords || keywords.length === 0) return undefined
  return keywords.join(', ')
}

export function makeSeo(params: SeoParams): Metadata {
  const canonical = params.canonicalPath ? `${BASE_URL}${params.canonicalPath}` : `${BASE_URL}`

  const openGraph = {
    type: 'website',
    locale: 'en_KE',
    siteName: 'SunSea Electrical',
    title: params.title,
    description: params.description,
    url: canonical,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: params.title,
        type: 'image/png',
      },
    ],
    ...params.openGraph,
  }

  return {
    title: {
      template: '%s | SunSea Electrical',
      default: params.title,
      absolute: params.title,
    },
    description: params.description,
    keywords: toCommaSeparated(params.keywords),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonical,
    },
    openGraph: openGraph,
    twitter: {
      card: 'summary_large_image',
      site: '@SunSeaElectrical',
      creator: '@SunSeaElectrical',
      title: params.title,
      description: params.description,
      images: [DEFAULT_OG_IMAGE],
      ...params.twitter,
    },
    applicationName: 'SunSea Electrical',
    authors: [
      { name: 'Peter Maina', url: BASE_URL },
    ],
    creator: 'SunSea Electrical',
    publisher: 'SunSea Electrical',
    category: 'Electrical Engineering & Construction',
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
    verification: {
       google: 'KLUXnzTPhZ4MRk6589XFSka4ut0xElD8Koq0y8x2Paw',
    },
  }
}