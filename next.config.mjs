/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Phase 6 will optimize real images; allow common remote hosts when added.
    remotePatterns: [],
  },
};

export default nextConfig;
