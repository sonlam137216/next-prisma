// app/admin/blog/new/page.tsx
'use client';

import BlogEditor from "@/components/BlogEditor";


export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Blog Post</h1>
        <p className="text-muted-foreground">
          Create and publish a new blog post
        </p>
      </div>

      <BlogEditor />
    </div>
  );
}