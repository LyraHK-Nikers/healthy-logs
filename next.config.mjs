/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // next-mdx-remote is on Next's default "server external" list, so by default
  // the article and author pages import it from node_modules at runtime. On
  // Hostinger that runtime import failed, crashing both routes with a 500.
  // Transpiling it forces it (and its ESM deps) into the server bundle instead.
  transpilePackages: ["next-mdx-remote"],
  images: {
    // Phase 6 will optimize real images; allow common remote hosts when added.
    remotePatterns: [],
  },
};

export default nextConfig;
