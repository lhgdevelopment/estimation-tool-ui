const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: false,
  },
  jsconfigPaths: true, // Move it here outside of the 'experimental' section
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision'),
    };

    return config;
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'localhost:3001',
  },
};
