// app/blog/[slug]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useBlogStore } from '../../store/blogStore';
import { format } from 'date-fns';
import { Clock, Calendar, BookOpen, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { loading, error, fetchPostBySlug, currentPost } = useBlogStore();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [updatedHtml, setUpdatedHtml] = useState<string>("");

  useEffect(() => {
    if (slug) {
      fetchPostBySlug(slug as string);
    }
  }, [slug, fetchPostBySlug]);

  useEffect(() => {
    if (currentPost?.content) {
      // Parse HTML content to extract headings and inject IDs
      const parser = new DOMParser();
      const doc = parser.parseFromString(currentPost.content, 'text/html');
      const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      const extractedHeadings = Array.from(headingElements).map((heading) => {
        const id = heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
        heading.id = id;
        return {
          id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName[1])
        };
      });

      // Serialize HTML back to string with IDs injected
      const updatedContent = doc.body.innerHTML;

      setHeadings(extractedHeadings);
      setUpdatedHtml(updatedContent);
    }
  }, [currentPost?.content]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentHeading = null;

      headingElements.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentHeading = heading.id;
        }
      });

      setActiveHeading(currentHeading);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Adjust for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-destructive text-xl mb-4">{error}</p>
        <Button onClick={() => {
          if (slug) {
            fetchPostBySlug(slug as string);
          }
        }}>Try Again</Button>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button variant="outline">
              <ChevronLeft size={16} className="mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 py-32 relative">
          <div className="max-w-7xl mx-auto">
            <Link href="/blog">
              <Button variant="ghost" className="text-white hover:text-white/90 mb-8 group">
                <ChevronLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Button>
            </Link>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">{currentPost.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/90">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                {currentPost.createdAt && format(new Date(currentPost.createdAt), 'MMM dd, yyyy')}
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                5 min read
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6 py-16">
        <div>
          {/* Featured Image */}
          {currentPost.featuredImage && (
            <div className="relative w-full h-[600px] mb-16 rounded-2xl overflow-hidden">
              <Image
                src={currentPost.featuredImage}
                alt={currentPost.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Table of Contents */}
          {headings.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold mb-6">Table of Contents</h2>
              <div className="flex flex-wrap gap-4">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => scrollToHeading(heading.id)}
                    className={cn(
                      "inline-flex items-center px-4 py-2 rounded-lg transition-all hover:bg-gray-50",
                      activeHeading === heading.id
                        ? "bg-primary/5 text-primary font-medium"
                        : "text-gray-600"
                    )}
                  >
                    {heading.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Blog Content */}
          <article className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: updatedHtml || currentPost.content || '' }} />
          </article>

          {/* Back to Top Button */}
          <div className="mt-16 text-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group"
            >
              Back to Top
              <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}