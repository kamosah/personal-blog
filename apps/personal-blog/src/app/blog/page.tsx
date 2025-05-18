import NextLink from 'next/link';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Link,
  Tag,
  Flex,
  Alert,
} from '@chakra-ui/react';
import { getAllPosts } from '../../lib/mdx/utils';
import { Post } from '../../lib/mdx/types';

export const metadata = {
  title: 'Blog | Personal Blog',
  description: 'Read my latest blog posts',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogIndex() {
  // Get all posts sorted by date
  const posts = getAllPosts();

  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" size="xl" mb={8}>
        Blog Posts
      </Heading>

      {posts.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Alert.Root
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            rounded="md"
            py={6}
          >
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title mt={4} mb={1} fontSize="lg">
                No blog posts found
              </Alert.Title>
              <Alert.Description maxWidth="sm">
                Add MDX files to the content directory to get started.
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        </Box>
      ) : (
        <VStack gap={8} align="stretch">
          {posts.map((post: Post) => (
            <Box key={post.slug} pb={6}>
              <Heading as="h2" size="lg" mb={2}>
                <Link
                  as={NextLink}
                  href={post.url}
                  _hover={{ textDecoration: 'underline' }}
                >
                  {post.title}
                </Link>
              </Heading>

              <Text color="gray.600" mb={3}>
                {formatDate(post.date)}
              </Text>

              {post.tags && post.tags.length > 0 && (
                <Flex flexWrap="wrap" gap={2}>
                  {post.tags.map((tag) => (
                    <Tag.Root
                      key={tag}
                      size="md"
                      variant="subtle"
                      colorScheme="blue"
                    >
                      <Tag.Label>{tag}</Tag.Label>
                    </Tag.Root>
                  ))}
                </Flex>
              )}

              <Box divideX="2px" mt={4} />
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
}
