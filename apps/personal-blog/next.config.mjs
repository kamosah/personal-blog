//@ts-check

// Import Nx plugins
import { composePlugins, withNx } from '@nx/next';
// Import MDX
import createMDX from '@next/mdx';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  nx: {},
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // TypeScript configuration
  typescript: {
    // Required for proper TypeScript checking with MDX
    ignoreBuildErrors: false,
  },
  // Image configuration (keeping it if it exists)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

// Configure MDX with enhanced features
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // We'll use the remark and rehype plugins in the serializer function instead
    // to ensure compatibility with next-mdx-remote
    providerImportSource: '@mdx-js/react',
  },
});

const plugins = [
  // Add more Next.js plugins to this list if needed
  withNx,
  withMDX,
];

// Export the configuration
export default composePlugins(...plugins)(nextConfig);