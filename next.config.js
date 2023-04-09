/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    if (!config.experiments) {
      config.experiments = {};
    }
    config.experiments.topLevelAwait = true;
    return config;
  },
  compiler: {
    styledComponents: true,
  },
  typescript: {
    // Expedite AWS deploy test. TODO: Turn off for final deploy
    ignoreBuildErrors: true,
  },
  eslint: {
    // Testing: allows production builds to successfully complete even if
    // project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  staticPageGenerationTimeout: 1000,
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: process.env.NEXT_PUBLIC_RESOURCE_PATH,

      },
    ];
  },

};
export default nextConfig;
