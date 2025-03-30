// app/blog/preview/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import MdxRenderer from '@/components/MdxRenderer';

export default function BlogPreviewPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // This is a simplified example; in practice you would fetch from your API
        // based on the slug and check for admin authentication
        const response = await fetch(`/api/admin/blog/preview/${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to load preview');
        }
        
        const data = await response.json();
        setPost(data.post);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preview');
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchPost();
    }
  }, [slug]);
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-500">Preview Not Available</h1>
        <p className="mt-4 text-gray-600">{error || 'Post not found'}</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
        <p className="font-medium">Preview Mode</p>
        <p className="text-sm">This is a preview of your blog post. It will not be visible to users until published.</p>
      </div>
      
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-xl text-gray-600 mb-8">{post.description}</p>
      
      {post.featuredImage && (
        <div className="relative w-full h-96 mb-8">
          <Image 
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
      
      <div className="prose prose-lg max-w-none">
        <MdxRenderer content={post.content || ''} />
      </div>
    </div>
  );
}