/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['github.com', 'user-attachments'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/user-attachments/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      os: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig; 