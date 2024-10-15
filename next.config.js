const path = require('path');
const dotenv = require('dotenv');
const removeImports = require("next-remove-imports")();

dotenv.config();

module.exports = removeImports({
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: false,
  },
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
});
