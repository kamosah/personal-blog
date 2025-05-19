import { notFound } from 'next/navigation';
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { getPostBySlug } from '../../../lib/mdx/utils';
import { formatDate } from '@/lib/utils/date';
import { calculateReadingTime } from '../../../lib/utils/readingTime';
import { Author } from '../../../lib/components/ui/Author';
import { FeaturedImage } from '../../../lib/components/ui/FeaturedImage';

export async function BlogPostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);

  // Handle case when post is not found
  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);
  return (
    <Container maxW="container.md" py={8}>
      <Text fontSize="sm" color="gray.500" mb={2}>
        {formatDate(post.date)} • {readingTime} min read
      </Text>
      <Heading as="h1" mb={8} fontSize="3xl">
        {post.title}
      </Heading>
      <Text fontSize="lg" mb={4} color="gray.600">
        {post.excerpt}
      </Text>
      <Author {...post.author} />
      <Box mt={8}>
        <FeaturedImage
          src={post.featuredImage.url}
          alt={post.featuredImage.alt}
          height={{ base: '200px', md: '300px', lg: '400px' }}
        />
      </Box>
      <article>{children}</article>
      {/* TODO: Add sidebar table of contents and related articles */}
    </Container>
  );
}

export default BlogPostLayout;
