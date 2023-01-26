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
  output: 'standalone',
};

export default nextConfig;
