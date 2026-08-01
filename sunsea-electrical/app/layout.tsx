import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata: Metadata = {
  title: "SunSea Electrical | Powering Homes, Businesses & Industries",
  description: "Professional electrical installations, maintenance, solar energy solutions and industrial electrical engineering across Kenya.",
  keywords: "electrical, solar energy, industrial electrical, commercial wiring, Kenya",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 pt-16 md:pt-20">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
