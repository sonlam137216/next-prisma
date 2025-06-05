// app/admin/blog/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useBlogStore } from '@/app/store/blogStore';
import BlogForm from '@/components/BlogForm';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditBlogPostPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const { currentPost, loading, error, fetchPostById } = useBlogStore();
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [hasFetchedContent, setHasFetchedContent] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPostById(id);
    }
  }, [id, fetchPostById]);

  useEffect(() => {
    async function fetchContent() {
      if (currentPost?.path && !hasFetchedContent) {
        try {
          const response = await fetch(currentPost.path);
          const content = await response.text();
          // Update the current post with the content
          useBlogStore.getState().setCurrentPost({
            ...currentPost,
            content
          });
          setHasFetchedContent(true);
          setIsContentLoaded(true);
        } catch (error) {
          console.error('Error fetching blog content:', error);
          setIsContentLoaded(true);
        }
      } else if (!currentPost?.path) {
        setIsContentLoaded(true);
      }
    }

    if (currentPost && !hasFetchedContent) {
      fetchContent();
    }
  }, [currentPost, hasFetchedContent]);

  if (loading || !isContentLoaded) {
    return (
      <div className="container mx-auto p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edit Blog Post</CardTitle>
            <CardDescription>
              Update your blog post content and settings
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edit Blog Post</CardTitle>
            <CardDescription>
              Update your blog post content and settings
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading blog post</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="container mx-auto p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edit Blog Post</CardTitle>
            <CardDescription>
              Update your blog post content and settings
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg mb-2">Blog post not found</p>
            <p className="text-sm text-muted-foreground">The post you are looking for does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Edit Blog Post</CardTitle>
          <CardDescription>
            Update your blog post content and settings
          </CardDescription>
        </CardHeader>
      </Card>
      <BlogForm post={currentPost} isEditing={true} />
    </div>
  );
}