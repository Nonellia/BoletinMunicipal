// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 👈 ignora errores de TypeScript
  },
  eslint: {
    ignoreDuringBuilds: true, // 👈 ignora errores de ESLint
  },
    reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
