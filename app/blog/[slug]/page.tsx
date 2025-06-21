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
  const data = await fetchData(`/api/blog/${(await params).slug}`);

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

  return (
    <div className="max-w-[1400px] mx-auto py-12 px-4 sm:px-5 lg:px-6">
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
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
      </div>

      {/* Client Component for Interactive Features */}
      <BlogDetailClient post={data.post} />
    </div>
  );
}