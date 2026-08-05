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
  const canonical = params.canonicalPath ? `${BASE_URL}${params.canonicalPath}` : undefined

  // Next.js metadata types vary between versions.
  // To avoid TS "openGraph.url typed as URL" issues, keep OG values fully `any`.
  const openGraph = (() => {
    const imagesInput = (params.openGraph as any)?.images
    const firstImage = Array.isArray(imagesInput) ? imagesInput[0] : imagesInput

    const ogUrl =
      typeof firstImage === 'string'
        ? firstImage
        : (firstImage && (firstImage as any).url) || DEFAULT_OG_IMAGE

    const ogImages: any = [
      {
        url: ogUrl,
        width: 1200,
        height: 630,
        alt: params.title,
      },
    ]

    const og: any = {
      type: 'website',
      locale: 'en_KE',
      siteName: 'SunSea Electrical',
      images: ogImages,
      ...params.openGraph,
    }

    if (canonical) og.url = canonical
    return og
  })()




return {
    title: params.title,
    description: params.description,
    keywords: toCommaSeparated(params.keywords),
    metadataBase: new URL(BASE_URL),
    alternates: canonical ? { canonical } : undefined,
    openGraph: openGraph as any,
applicationName: 'SunSea Electrical',
    authors: [{ name: 'David Munene', url: BASE_URL }, { name: 'SunSea Electrical', url: BASE_URL }],
    creator: 'David Munene',
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
    twitter: {
      card: 'summary_large_image',
      site: '@SunSeaElectrical',
      creator: '@SunSeaElectrical',
      ...params.twitter,
    } as any,
  } as any

}
