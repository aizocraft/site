import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";

const COMPANY = {
  name: "Nenes Construction",
  url: "https://nenesconstruction.vercel.app",
  phone: "+254717780056",
  email: "nenesconstruction@gmail.com",
  address: "Nairobi, Kenya",
  founded: "2010",
};

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.url),
  title: {
    default: "Nenes Construction | Building Excellence Across Kenya",
    template: "%s | Nenes Construction",
  },
description:
    "Nenes Construction — professional construction company in Kenya led by David Munene. We offer general contracting, residential construction, commercial buildings, renovation & remodeling, architectural design, and project management. Building Kenya's future across Nairobi, Embu, Meru, Nyeri, Tharaka-Nithi, Kirinyaga, Nakuru, Mombasa, Eldoret, Kisumu, Kiambu, Machakos and all counties.",
  applicationName: COMPANY.name,
  authors: [{ name: "David Munene", url: COMPANY.url }, { name: COMPANY.name, url: COMPANY.url }],
  creator: "David Munene",
  publisher: COMPANY.name,
  category: "Construction & Building",
  keywords: [
    "Nenes Construction",
    "Nenes Construction Kenya",
    "Nenes Construction company",
    "David Munene",
    "David Munene construction",
    "David Munene contractor",
    "David Munene Kenya",
    "David Munene builder",
    "Nenes Construction David Munene",
    "construction company Kenya",
    "building contractor Kenya",
    "general contractor Kenya",
    "construction company Nairobi",
    "building contractor Nairobi",
    "construction company Embu",
    "construction company Meru",
    "construction company Nyeri",
    "construction company Tharaka-Nithi",
    "construction company Kirinyaga",
    "construction company Muranga",
    "construction company Nakuru",
    "construction company Mombasa",
    "construction company Eldoret",
    "construction company Kisumu",
    "construction company Kiambu",
    "construction company Machakos",
    "construction company Naivasha",
    "construction company Nanyuki",
    "construction company Garissa",
    "construction company Turkana",
    "house construction Kenya",
    "house construction Nairobi",
    "house construction Embu",
    "house construction Meru",
    "house construction Nyeri",
    "apartment construction Kenya",
    "apartment construction Nairobi",
    "residential construction Kenya",
    "commercial building Kenya",
    "commercial construction Kenya",
    "industrial construction Kenya",
    "warehouse construction Kenya",
    "office building construction Kenya",
    "hospital construction Kenya",
    "school construction Kenya",
    "mall construction Kenya",
    "estate development Kenya",
    "real estate developer Kenya",
    "renovation services Kenya",
    "home renovation Kenya",
    "house remodeling Kenya",
    "architectural design Kenya",
    "architect Nairobi",
    "structural engineering Kenya",
    "project management Kenya",
    "construction management Kenya",
    "structural inspection Kenya",
    "building inspection Kenya",
    "NCA contractor Kenya",
    "NCA 1 contractor Kenya",
    "NCA 3 contractor Kenya",
    "NCA 6 contractor Kenya",
    "tuangaza contractor",
    "best construction company in Kenya",
    "top building contractors Kenya",
    "construction services Nairobi",
    "construction services Embu",
    "construction services Meru",
    "affordable house construction Kenya",
    "cost of building a house Kenya",
    "building contractor Kiambu",
    "building contractor Nakuru",
    "building contractor Mombasa",
    "building contractor Eldoret",
    "building contractor Kisumu",
    "building contractor Embu",
    "building contractor Meru",
    "interior finishing Kenya",
    "exterior finishing Kenya",
    "landscaping Kenya",
    "civil engineering Kenya",
    "quantity surveyor Kenya",
    "construction consultancy Kenya",
    "turnkey construction Kenya",
    "design and build Kenya",
  ],
  alternates: {
    canonical: COMPANY.url,
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: COMPANY.url,
    siteName: COMPANY.name,
    title: "Nenes Construction | Building Excellence Across Kenya",
    description:
      "Professional construction services — residential, commercial, and industrial building across Kenya. General contracting, design, build, and renovation. From Nairobi to all counties.",
    images: [
      {
        url: `${COMPANY.url}/nenesposter.png`,
        width: 1200,
        height: 630,
        alt: "Nenes Construction",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nenes Construction | Building Excellence Across Kenya",
    description:
      "General contracting, residential construction, commercial buildings, renovation, and project management across Kenya. Get a free quote from Nenes Construction.",
    images: [`${COMPANY.url}/nenesposter.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ConstructionBusiness",
  name: COMPANY.name,
  url: COMPANY.url,
  logo: `${COMPANY.url}/favicon.png`,
  image: `${COMPANY.url}/nenesposter.png`,
description: metadata.description,
  telephone: COMPANY.phone,
  email: COMPANY.email,
  founder: {
    "@type": "Person",
    name: "David Munene",
    jobTitle: "Founder & Managing Director",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.address,
    addressLocality: "Nairobi",
    addressRegion: "Nairobi County",
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.2921,
    longitude: 36.8219,
  },
  foundingDate: COMPANY.founded,
  areaServed: [
    { "@type": "Place", name: "Nairobi" },
    { "@type": "Place", name: "Embu" },
    { "@type": "Place", name: "Meru" },
    { "@type": "Place", name: "Nyeri" },
    { "@type": "Place", name: "Tharaka-Nithi" },
    { "@type": "Place", name: "Kirinyaga" },
    { "@type": "Place", name: "Nakuru" },
    { "@type": "Place", name: "Mombasa" },
    { "@type": "Place", name: "Eldoret" },
    { "@type": "Place", name: "Kisumu" },
    { "@type": "Place", name: "Kiambu" },
    { "@type": "Place", name: "Machakos" },
    { "@type": "Place", name: "Kenya" },
  ],
  knowsAbout: [
    "General Contracting",
    "Residential Construction",
    "Commercial Buildings",
    "Renovation & Remodeling",
    "Architectural Design",
    "Project Management",
    "Structural Inspection",
  ],
  sameAs: [
    "https://www.facebook.com/nenesconstruction",
    "https://www.instagram.com/nenesconstruction",
    "https://www.linkedin.com/company/nenesconstruction",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
