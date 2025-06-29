"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ChevronDown, ChevronRight } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  description?: string;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
  readingTime: number;
  category: string;
}

interface BlogDetailClientProps {
  post: BlogPost;
}

export function BlogDetailClient({ post }: BlogDetailClientProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [updatedHtml, setUpdatedHtml] = useState<string>("");
  const [isTocOpen, setIsTocOpen] = useState(true);

  useEffect(() => {
    if (post.content) {
      // Parse HTML content to extract headings and inject IDs
      const parser = new DOMParser();
      const doc = parser.parseFromString(post.content, 'text/html');
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
  }, [post.content]);

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

  const getIndentClass = (level: number) => {
    switch (level) {
      case 1: return 'ml-0';
      case 2: return 'ml-4';
      case 3: return 'ml-8';
      case 4: return 'ml-12';
      case 5: return 'ml-16';
      case 6: return 'ml-20';
      default: return 'ml-0';
    }
  };

  return (
    <div>
      {/* Table of Contents */}
      {headings.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Mục lục</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="flex items-center gap-2"
            >
              {isTocOpen ? (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Thu gọn
                </>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4" />
                  Mở rộng
                </>
              )}
            </Button>
          </div>
          
          {isTocOpen && (
            <div className="bg-gray-50 rounded-lg p-6 border">
              <div className="space-y-2">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => scrollToHeading(heading.id)}
                    className={cn(
                      "w-full text-left py-2 px-3 rounded-md transition-all hover:bg-white hover:shadow-sm",
                      "flex items-center gap-2",
                      getIndentClass(heading.level),
                      activeHeading === heading.id
                        ? "bg-primary/10 text-primary font-medium border-l-4 border-primary"
                        : "text-gray-700"
                    )}
                  >
                    <span className="text-xs text-gray-400 font-mono">
                      {heading.level === 1 ? '#' : heading.level === 2 ? '##' : '###'}
                    </span>
                    <span className="truncate">{heading.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Blog Content */}
      <article className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: updatedHtml || post.content || '' }} />
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
          <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
} 