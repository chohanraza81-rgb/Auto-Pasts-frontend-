/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: '*' }],
    formats: ['image/webp']
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default nextConfig;
