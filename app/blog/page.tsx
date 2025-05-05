// app/blog/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBlogStore } from '../store/blogStore';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Calendar, Tag, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  
  const { 
    posts, 
    loading, 
    error, 
    pagination, 
    fetchPosts, 
    setPage 
  } = useBlogStore();

  // State for category filter (if you want to add this later)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Initialize blog data
  useEffect(() => {
    fetchPosts(page);
  }, [fetchPosts, page]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    // Update the URL with the new page
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/blog?${params.toString()}`);
  };

  // Format date function
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Insights, stories, and ideas from our team on technology, design, and innovation.
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive text-xl">{error}</p>
            <Button 
              onClick={() => fetchPosts(page)}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
            <div className="inline-flex justify-center items-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <BookOpen size={32} className="text-gray-400" />
            </div>
            <p className="text-2xl font-medium text-gray-800 mb-2">No blog posts found</p>
            <p className="text-gray-500 max-w-md mx-auto">
              It seems we don't have any blog posts yet. Check back later for new content.
            </p>
          </div>
        ) : (
          <>
            {/* Blog Posts Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link 
                  href={`/blog/${post.slug}`}
                  key={post.slug}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-50">
                        <BookOpen size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>{post.createdAt && formatDate(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>5 min read</span>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {post.description || "Read this article to learn more..."}
                    </p>
                    
                    <span className="inline-flex items-center text-primary font-medium">
                      Read more
                      <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.page ? "default" : "outline"}
                      size="icon"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}