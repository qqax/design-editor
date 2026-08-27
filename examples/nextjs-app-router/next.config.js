/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@fastlabai/design-editor'],
  webpack: (config) => {
    config.externals.push({
      canvas: 'commonjs canvas',
      jsdom: 'commonjs jsdom',
    });
    return config;
  },
};

module.exports = nextConfig;
