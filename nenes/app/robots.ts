import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/_next"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api", "/_next"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api", "/_next"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api", "/_next"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api", "/_next"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api", "/_next"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api", "/_next"],
      },
    ],
    sitemap: "https://nenesconstruction.vercel.app/sitemap.xml",
    host: "https://nenesconstruction.vercel.app",
  };
}
