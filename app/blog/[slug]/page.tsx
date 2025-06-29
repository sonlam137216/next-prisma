// app/blog/[slug]/page.tsx
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { format } from 'date-fns';
import { BookOpen, Calendar, ChevronLeft, Clock } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BlogDetailClient } from './BlogDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

// Helper function to fetch data with error handling
async function fetchData(path: string) {
  try {
    // In production, we need to use the full URL
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'http://14.225.212.72'  // Your VPS domain
      : 'http://localhost:3000';
    
    const url = `${baseUrl}${path}`;
    console.log('Debug - Fetching data from:', url);
    console.log('Debug - NODE_ENV:', process.env.NODE_ENV);
    
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=60',
      },
    });

    console.log('Debug - Response status:', response.status);
    console.log('Debug - Response data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Debug - Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      });
    } else {
      console.error(`Error fetching data from ${path}:`, error);
    }
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchData(`/api/blog/${(await params).slug}`);

  if (!data?.post) {
    return {
      title: 'Blog Post Not Found | Gem Store',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${data.post.title} | Gem Store Blog`,
    description: data.post.description,
    openGraph: {
      title: data.post.title,
      description: data.post.description,
      type: 'article',
      publishedTime: data.post.createdAt,
      modifiedTime: data.post.updatedAt,
      authors: ['Gem Store'],
      images: [
        {
          url: data.post.featuredImage || '/images/blog-placeholder.jpg',
          width: 1200,
          height: 630,
          alt: data.post.title,
        },
      ],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const data = await fetchData(`/api/blog/${resolvedParams.slug}`);

  if (!data?.post) {
    return (
      <div className="max-w-[1400px] mx-auto py-12 px-4 sm:px-5 lg:px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you are looking for does not exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/blog">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fetch sidebar data from APIs
  const [categoriesData, latestPostsData, relatedPostsData] = await Promise.all([
    fetchData('/api/blog/categories'),
    fetchData('/api/blog?page=1&pageSize=4'),
    fetchData(`/api/blog?category=${encodeURIComponent(data.post.category)}&page=1&pageSize=3`)
  ]);

  const categories = categoriesData?.categories || [];
  const latestPosts = latestPostsData?.posts || [];
  const relatedPosts = relatedPostsData?.posts?.filter((post: any) => post.slug !== resolvedParams.slug) || [];

  return (
    <div className="max-w-[1400px] mx-auto py-12 px-4 sm:px-5 lg:px-6 mt-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-8/12">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm text-muted-foreground flex items-center gap-1" aria-label="Breadcrumb">
            <Link href="/blog" className="hover:underline text-primary">Blog</Link>
            <span className="mx-1">/</span>
            <Link href={`/blog?category=${encodeURIComponent(data.post.category)}`} className="hover:underline text-primary">{data.post.category}</Link>
            <span className="mx-1">/</span>
            <span className="font-medium text-gray-900 line-clamp-1 max-w-xs truncate">{data.post.title}</span>
          </nav>
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/blog">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Featured Image */}
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={data.post.featuredImage || '/images/blog-placeholder.jpg'}
              alt={data.post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Post Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{data.post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(data.post.createdAt), 'dd/MM/yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{data.post.readingTime} phút đọc</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{data.post.category}</span>
              </div>
            </div>
            {data.post.description && (
              <div className="text-lg text-gray-700 mb-2">{data.post.description}</div>
            )}
          </div>

          {/* Client Component for Interactive Features */}
          <BlogDetailClient post={data.post} />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Bài viết liên quan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((post: any) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={post.featuredImage || '/images/blog-placeholder.jpg'}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(post.createdAt), 'dd/MM/yyyy')}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      {post.description && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                          {post.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{post.readingTime} phút</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-4/12 flex-shrink-0">
          {/* Latest Posts */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Bài viết mới nhất</h2>
            <ul className="space-y-6">
              {latestPosts.map((post: any, idx: number) => (
                <li key={post.id || idx} className="flex items-center gap-4">
                  <div className="w-20 h-20 relative flex-shrink-0 rounded overflow-hidden">
                    <Image 
                      src={post.featuredImage || '/images/blog-placeholder.jpg'} 
                      alt={post.title} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div>
                    <Link href={`/blog/${post.slug}`} className="font-medium hover:underline line-clamp-2 block text-base">
                      {post.title}
                    </Link>
                    <div className="text-sm text-muted-foreground mt-2">
                      {format(new Date(post.createdAt), 'dd.MM.yyyy')}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Categories */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Danh mục bài viết</h2>
            <ul className="space-y-3">
              {categories.map((cat: string, idx: number) => (
                <li key={idx}>
                  <Link 
                    href={`/blog?category=${encodeURIComponent(cat)}`}
                    className="text-base text-gray-700 hover:underline cursor-pointer block py-1"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}