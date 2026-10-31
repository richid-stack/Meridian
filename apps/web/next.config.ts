import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@meridian/ui', '@meridian/tokens', '@meridian/domain', '@meridian/api-client', '@meridian/contracts', '@meridian/i18n'],
  reactStrictMode: true,
};
export default config;
