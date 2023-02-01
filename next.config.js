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
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'http://ec2-18-207-1-154.compute-1.amazonaws.com:3000',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/graphql',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Private-Network', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'http://ec2-18-207-1-154.compute-1.amazonaws.com:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, >',
          },
        ],
      },
    ];
  },
};
export default nextConfig;
