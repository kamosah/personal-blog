//@ts-check

// Import Nx plugins
import { composePlugins, withNx } from '@nx/next';
// Import MDX plugins
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
// Import MDX
import createMDX from '@next/mdx';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // TypeScript configuration
  typescript: {
    // Required for proper TypeScript checking with MDX
    ignoreBuildErrors: false,
  },
  // Add experimental flags for MDX support
  experimental: {
    mdxRs: true, // Enable the MDX compiler's rust implementation
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
    // Add remark and rehype plugins for enhanced MDX features
    remarkPlugins: [
      remarkGfm, // GitHub Flavored Markdown support
    ],
    rehypePlugins: [
      rehypeSlug, // Add IDs to headings
      [rehypeAutolinkHeadings, { behavior: 'wrap' }], // Add links to headings
      rehypeHighlight, // Syntax highlighting
    ],
    // Provide React for MDX content
    providerImportSource: '@mdx-js/react',
  },
});

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withMDX,
];

// Export the configuration
export default composePlugins(...plugins)(nextConfig);
