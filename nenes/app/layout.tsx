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
    "Nenes Construction — professional construction company in Kenya offering general contracting, residential construction, commercial buildings, renovation & remodeling, architectural design, and project management. Building Kenya's future across Nairobi, Embu, Meru, Nyeri, Nakuru, Mombasa, Eldoret, Kisumu, Kiambu, Machakos and all counties.",
  applicationName: COMPANY.name,
  authors: [{ name: COMPANY.name, url: COMPANY.url }],
  creator: COMPANY.name,
  publisher: COMPANY.name,
  category: "Construction",
  keywords: [
    "Nenes Construction",
    "construction company Kenya",
    "building contractor Kenya",
    "general contractor Kenya",
    "residential construction Kenya",
    "commercial building Kenya",
    "construction company Nairobi",
    "building contractor Nairobi",
    "construction company Embu",
    "construction company Meru",
    "construction company Nyeri",
    "construction company Nakuru",
    "construction company Mombasa",
    "construction company Eldoret",
    "construction company Kisumu",
    "construction company Kiambu",
    "construction company Machakos",
    "house construction Kenya",
    "apartment construction Kenya",
    "warehouse construction Kenya",
    "renovation services Kenya",
    "architectural design Kenya",
    "project management Kenya",
    "structural inspection Kenya",
    "building contractor Kiambu",
    "building contractor Nakuru",
    "building contractor Mombasa",
    "building contractor Eldoret",
    "building contractor Kisumu",
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
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressRegion: "Nairobi County",
    addressCountry: "KE",
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
