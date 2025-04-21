// app/blog/preview/[slug]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function BlogPreviewPage() {
  const { slug } = useParams();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBlogContent() {
      try {
        setLoading(true);
        const response = await fetch(`/blog-content/${slug}.html`);
        
        if (!response.ok) {
          throw new Error(`Failed to load blog content: ${response.statusText}`);
        }
        
        const htmlContent = await response.text();
        setHtml(htmlContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error loading blog content:', err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadBlogContent();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-primary/10 p-4 text-center mb-6">
        <p className="text-sm font-medium">Preview Mode</p>
      </div>
      
      <div 
        className="blog-content" 
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}