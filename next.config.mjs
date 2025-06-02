/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output for self-hosting
  output: 'standalone',
  
  images: {
    domains: ['v0.blob.com', 'hebbkx1anhila5yf.public.blob.vercel-storage.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v0.blob.com',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
    ],
    // Keep unoptimized for simplicity, or set up your own image optimization
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
