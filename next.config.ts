import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   // Enable experimental features for Turbopack
   experimental: {
    // Turbopack experimental features can be configured here
  },
  // Configure webpack to handle both font loading and Node.js modules
  webpack: (config, { isServer }) => {
    // Add a rule for handling font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    });

    // Handle Node.js modules for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

export default nextConfig;
