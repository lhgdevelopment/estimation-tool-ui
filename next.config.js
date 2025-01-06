const path = require('path');
const dotenv = require('dotenv');
const removeImports = require('next-remove-imports')();

dotenv.config();

module.exports = removeImports({
  // Ensure no trailing slashes
  trailingSlash: false,

  // React Strict Mode
  reactStrictMode: true,

  // Webpack configuration
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision'),
    };
    return config;
  },

  // Disable SSR where possible
  experimental: {
    appDir: false, // Ensures the app directory is not used for SSR features
    esmExternals: true, // Use ES Modules, which work better for CSR
  },

  // Default to client-side rendering
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001',
  },

  // Disable any automatic static optimization (forces CSR)
  // Note: Removing `getStaticProps` and `getServerSideProps` in your pages is required.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate', // Prevent pre-rendering caching
          },
        ],
      },
    ];
  },
});
