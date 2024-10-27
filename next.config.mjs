/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.jsdelivr.net',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_DISCORD_URL: 'https://discord.gg/5rAUt8X4pj',
  },
}

export default nextConfig
