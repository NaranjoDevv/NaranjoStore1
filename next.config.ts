import { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Desactivar ESLint durante el build
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
  /* config options here */
};

export default nextConfig;
