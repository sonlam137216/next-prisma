"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

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

  return (
    <div>
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