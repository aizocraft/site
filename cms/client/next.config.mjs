/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },
  images: {
    remotePatterns: [
      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },

      // Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },

      // Placeholder
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },

      // LOCAL API
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**',
      },

      // RENDER API
      {
        protocol: 'https',
        hostname: 'pwa-6vb1.onrender.com',
        pathname: '/**',
      },
    ],
  },

  reactStrictMode: true,
};

export default nextConfig;