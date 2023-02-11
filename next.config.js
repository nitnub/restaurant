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
  // async headers() {
  //   return [
  //     {
  //       source: '/api/:path',
  //       headers: [
  //         { key: 'Access-Control-Allow-Credentials', value: 'false' },
  //         { key: 'Access-Control-Allow-Private-Network', value: 'true' },
  //         {
  //           key: 'Access-Control-Allow-Origin',
  //           value: process.env.AWS_URL,
  //         },
  //         {
  //           key: 'Access-Control-Allow-Methods',
  //           value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  //         },
  //         {
  //           key: 'Access-Control-Allow-Headers',
  //           value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, >',
  //         },
  //       ],
  //     },
  //   ];
  // },
};
export default nextConfig;
