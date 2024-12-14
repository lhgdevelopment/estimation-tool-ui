const path = require('path');
const dotenv = require('dotenv');
const removeImports = require('next-remove-imports')();

dotenv.config();

module.exports = removeImports({
  // Ensure clean URLs (use trailingSlash only if required)
  trailingSlash: false,

  // React Strict Mode
  reactStrictMode: true, // Recommended to enable strict mode for debugging

  // Webpack configuration
  webpack: (config) => {
    // Custom alias for apexcharts-clevision
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision'),
    };

    // Return updated config
    return config;
  },

  // Environment variables
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001',
  },

  // Experimental features (update based on your Next.js version)
  experimental: {
    esmExternals: 'loose', // `loose` for compatibility, or remove for stable behavior
  },
});
