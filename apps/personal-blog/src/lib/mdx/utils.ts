import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { computePostUrl, Post, PostFrontmatter, RenderedPost } from './types';

// Path to the content directory
const CONTENT_PATH = path.join(process.cwd(), 'content');

/**
 * Reads and parses an MDX file
 * @param filePath Path to the MDX file
 * @returns Parsed post with frontmatter and content
 */
export function parsePostFile(filePath: string): Post {
  try {
    // Read the file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter and content
    const { data, content } = matter(fileContents);
    
    // Validate required fields
    if (!data.title || !data.date || !data.slug) {
      throw new Error(`Missing required frontmatter fields in ${filePath}`);
    }
    
    // Type assertion for frontmatter
    const frontmatter = data as PostFrontmatter;
    
    // Return post with computed URL
    return {
      ...frontmatter,
      content,
      url: computePostUrl(frontmatter.slug),
    };
  } catch (error) {
    // Re-throw with more context
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error parsing MDX file ${filePath}: ${errorMessage}`);
  }
}

/**
 * Gets all posts from the content directory
 * @returns Array of posts sorted by date (newest first)
 */
export function getAllPosts(): Post[] {
  try {
    // Ensure the content directory exists
    if (!fs.existsSync(CONTENT_PATH)) {
      console.warn('Content directory does not exist yet. Creating it...');
      fs.mkdirSync(CONTENT_PATH, { recursive: true });
      return [];
    }
    
    // Get all MDX files
    const fileNames = fs.readdirSync(CONTENT_PATH)
      .filter(fileName => /\.mdx?$/.test(fileName));
    
    // Parse each file
    const posts = fileNames.map(fileName => {
      const filePath = path.join(CONTENT_PATH, fileName);
      return parsePostFile(filePath);
    });
    
    // Sort posts by date (newest first)
    return posts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}

/**
 * Gets a single post by slug
 * @param slug The post slug
 * @returns The post or null if not found
 */
export function getPostBySlug(slug: string): Post | null {
  try {
    const posts = getAllPosts();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error(`Error getting post with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Serializes MDX content for rendering
 * @param post The post with MDX content
 * @returns Promise resolving to serialized MDX content
 */
export async function serializeMdx(post: Post): Promise<any> {
  try {
    const mdxSource = await serialize(post.content, {
      // MDX options
      parseFrontmatter: false, // Already parsed with gray-matter
      scope: post, // Pass frontmatter data to MDX
    });
    
    return mdxSource;
  } catch (error) {
    console.error(`Error serializing MDX for post "${post.title}":`, error);
    throw error;
  }
}

