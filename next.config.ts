import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   // Enable experimental features for Turbopack
   experimental: {
    // Turbopack experimental features can be configured here
  },
  // Configure webpack to handle font loading
  webpack: (config) => {
    // Add a rule for handling font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
