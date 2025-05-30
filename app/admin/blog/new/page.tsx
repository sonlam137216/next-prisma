// app/admin/blog/new/page.tsx
'use client';

import BlogForm from "@/components/BlogForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewBlogPostPage() {
  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
          <CardDescription>
            Create and publish a new blog post
          </CardDescription>
        </CardHeader>
      </Card>
      <BlogForm />
    </div>
  );
}