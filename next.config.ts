import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the local design preview free of the development-only floating badge.
  devIndicators: false,
};

export default nextConfig;
