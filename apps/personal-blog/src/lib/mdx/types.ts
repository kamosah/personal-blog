/**
 * Types for MDX blog posts
 */

/**
 * Represents the frontmatter for a blog post
 */
export interface PostFrontmatter {
  title: string;
  date: string; // ISO date string
  slug: string;
  tags?: string[];
}

/**
 * Represents a processed blog post with content and metadata
 */
export interface Post extends PostFrontmatter {
  content: string; // Raw MDX content
  url: string; // Computed URL
}

/**
 * Represents a blog post with rendered MDX content
 */
export interface RenderedPost extends PostFrontmatter {
  url: string;
  // This will hold the compiled MDX content
  // The actual type will depend on how we use next-mdx-remote
}

/**
 * Helper function to compute the URL for a post
 */
export function computePostUrl(slug: string): string {
  return `/blog/${slug}`;
}

