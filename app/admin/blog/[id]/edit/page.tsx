// app/admin/blog/[id]/edit/page.tsx
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useBlogStore } from '@/app/store/blogStore';
import BlogEditor from '@/components/BlogEditor';

export default function EditBlogPostPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const { currentPost, loading, error, fetchPostById } = useBlogStore();

  useEffect(() => {
    if (id) {
      fetchPostById(id);
    }
  }, [id, fetchPostById]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading post...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading blog post</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      );
    }

    if (!currentPost) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg mb-2">Blog post not found</p>
            <p className="text-sm text-muted-foreground">The post you are looking for does not exist.</p>
          </div>
        </div>
      );
    }

    return <BlogEditor post={currentPost} />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
        <p className="text-muted-foreground">
          Update your blog post content
        </p>
      </div>

      {renderContent()}
    </div>
  );
}