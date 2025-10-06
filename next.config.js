/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Enable the new JSX transform
    reactRemoveProperties: true,
  },
};

module.exports = nextConfig;
