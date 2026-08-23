/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: '*' }],
    formats: ['image/webp']
  },
  revalidate: 86400,
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};
export default nextConfig;
