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
  // Set the app directory to be in src
  distDir: 'dist',
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