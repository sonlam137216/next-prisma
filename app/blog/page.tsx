// app/blog/page.tsx
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';

// Interface for blog post metadata
interface BlogPost {
  slug: string;
  title: string;
  description: string;
  featuredImage?: string;
  publishedDate: string;
}

// Function to extract metadata from HTML file
async function extractMetadata(filePath: string, slug: string): Promise<BlogPost | null> {
  try {
    const content = await fsPromises.readFile(filePath, 'utf-8');
    
    // Extract title
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : slug;
    
    // Extract description (assuming it's in a meta tag)
    const descriptionMatch = content.match(/<meta name="description" content="(.*?)"/);
    const description = descriptionMatch ? descriptionMatch[1] : '';
    
    // You could extract featured image here if it's in the HTML
    // For now, we'll use a default
    const featuredImage = '/placeholder.jpg';
    
    // Get published date from file stats
    const stats = await fsPromises.stat(filePath);
    const publishedDate = stats.mtime.toISOString().split('T')[0];
    
    return {
      slug,
      title,
      description,
      featuredImage,
      publishedDate,
    };
  } catch (error) {
    console.error(`Error extracting metadata for ${slug}:`, error);
    return null;
  }
}

export default async function BlogPage() {
  // Get all blog posts
  const blogDir = path.join(process.cwd(), 'public', 'blog-content');
  let posts: BlogPost[] = [];
  
  try {
    // Check if directory exists
    if (fs.existsSync(blogDir)) {
      const files = await fsPromises.readdir(blogDir);
      const htmlFiles = files.filter(file => file.endsWith('.html'));
      
      // Extract metadata from each file
      const postsPromises = htmlFiles.map(async (file) => {
        const slug = file.replace('.html', '');
        const filePath = path.join(blogDir, file);
        return await extractMetadata(filePath, slug);
      });
      
      // Filter out any null results
      const allPosts = await Promise.all(postsPromises);
      posts = allPosts.filter((post): post is BlogPost => post !== null);
      
      // Sort by date (newest first)
      posts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No blog posts found.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link 
              href={`/blog/${post.slug}`}
              key={post.slug}
              className="group"
            >
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                {post.featuredImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-2">{post.publishedDate}</p>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-3">{post.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}