/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
};

export default nextConfig;
