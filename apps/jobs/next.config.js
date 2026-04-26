/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@zenkai/ui"],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

module.exports = nextConfig;
