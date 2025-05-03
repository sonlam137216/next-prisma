// app/blog/[slug]/page.tsx
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import { format } from 'date-fns';

const prisma = new PrismaClient();

// Generate static params for static generation
export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    select: { slug: true },
    where: { published: true },
  });
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function getBlogPost(slug: string) {
  try {
    // Get the blog post from the database
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });
    
    if (!post) {
      return null;
    }
    
    // Get the HTML content
    const filePath = path.join(process.cwd(), 'public', post.path.replace(/^\//, ''));
    
    if (!fs.existsSync(filePath)) {
      return { post, content: null };
    }
    
    const content = await fsPromises.readFile(filePath, 'utf-8');
    
    return { post, content };
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error);
    return null;
  }
}

// Function to extract the body content from the full HTML
function extractBodyContent(htmlContent: string) {
  const bodyMatch = htmlContent.match(/<article class="content">([\s\S]*?)<\/article>/);
  return bodyMatch ? bodyMatch[1] : htmlContent;
}

// Function to get reading time
function getReadingTime(content: string) {
  // Strip HTML tags
  const plainText = content.replace(/<[^>]*>/g, '');
  // Average reading speed: 200 words per minute
  const words = plainText.split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
  return readingTimeMinutes;
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const result = await getBlogPost(params.slug);
  
  if (!result) {
    notFound();
  }
  
  const { post, content } = result;
  
  if (!content) {
    notFound();
  }
  
  // Extract title from HTML content
  const titleMatch = content.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : post.title;
  
  // Extract body content
  const bodyContent = extractBodyContent(content);
  
  // Calculate reading time
  const readingTime = getReadingTime(bodyContent);
  
  // Format date
  const formattedDate = format(new Date(post.createdAt), 'MMMM dd, yyyy');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Featured Image */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        {post.featuredImage && (
          <div className="absolute inset-0 opacity-20">
            <Image 
              src={post.featuredImage} 
              alt={title} 
              fill 
              className="object-cover" 
              priority
            />
          </div>
        )}
        
        <div className="relative container mx-auto px-4 pt-28 pb-20">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm text-blue-200 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to all articles
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-4xl">{title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-blue-100 gap-x-6 gap-y-2">
            <div className="flex items-center">
              <User size={16} className="mr-2" />
              <span>Admin</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* If featured image exists, show it at the top of the content */}
          {post.featuredImage && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <Image 
                src={post.featuredImage} 
                alt={title} 
                width={800} 
                height={450} 
                className="w-full h-auto" 
              />
            </div>
          )}
          
          {/* Article Content */}
          <article className="prose prose-lg max-w-none bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
          </article>
          
          {/* Share buttons */}
          <div className="mt-12 flex justify-center">
            <div className="bg-white rounded-full shadow-sm border border-gray-100 p-2 flex space-x-2">
              <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition">
                <Share2 size={18} />
              </button>
              <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </button>
              <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </button>
              <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </button>
              <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Related Posts - Could be implemented later */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* This would require a separate API call to get related posts */}
              {/* Placeholder for now */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">April 12, 2025</p>
                  <h3 className="text-lg font-bold mb-2 hover:text-blue-600 transition-colors">
                    Related article title would go here
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    This is where a brief excerpt from a related article would be displayed to entice the reader to click.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">April 3, 2025</p>
                  <h3 className="text-lg font-bold mb-2 hover:text-blue-600 transition-colors">
                    Another related article title here
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    This would be another related article excerpt shown to provide more content options for readers.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Enjoyed this article?</h3>
            <p className="text-blue-100 mb-6">Subscribe to our newsletter to get the latest updates right in your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                required
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}