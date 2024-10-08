/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.jsdelivr.net',
      },
    ],
    domains: ['raw.githubusercontent.com'],
  },
}

export default nextConfig
