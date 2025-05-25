// app/admin/blog/[id]/page.tsx
'use client';

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useBlogStore, BlogPost } from "@/app/store/blogStore";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import Image from "next/image";

// Dynamically import the editor to avoid SSR issues
const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
});

const categories = [
  "Phong thủy",
  "Đá quý",
  "Kiến thức",
  "Tin tức",
];

export default function BlogPostEditor({ params }: { params: Promise<{ id: string }> }) {
  console.log('BlogPostEditor rendered with params:', params);
  
  const router = useRouter();
  const { id } = use(params);
  const isNewPost = id === "new";
  const { currentPost, loading, error, fetchPostById, createPost, updatePost } =
    useBlogStore();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    category: "Phong thủy",
    published: false,
    featuredImage: null as File | null,
    existingFeaturedImage: "",
  });

  // Fetch post data when component mounts
  useEffect(() => {
    console.log('Component mounted, isNewPost:', isNewPost);
    if (!isNewPost) {
      const postId = parseInt(id);
      console.log('Fetching post with ID:', postId);
      fetchPostById(postId);
    }
  }, [isNewPost, id, fetchPostById]);

  // Update form data when currentPost changes
  useEffect(() => {
    console.log('Current post changed:', currentPost);
    if (currentPost && !isNewPost) {
      console.log('Setting form data with post:', currentPost);
      setFormData({
        title: currentPost.title,
        content: currentPost.content || "",
        description: currentPost.description || "",
        category: currentPost.category,
        published: currentPost.published,
        featuredImage: null,
        existingFeaturedImage: currentPost.featuredImage || "",
      });
    }
  }, [currentPost, isNewPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData: Partial<BlogPost> = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        published: formData.published,
        readingTime: 5, // Default reading time
      };

      if (!isNewPost && currentPost) {
        postData.id = currentPost.id;
        postData.slug = currentPost.slug;
        postData.createdAt = currentPost.createdAt;
        postData.updatedAt = new Date().toISOString();
      }

      if (isNewPost) {
        await createPost(postData as BlogPost, formData.content, formData.featuredImage || undefined);
        toast.success("Tạo bài viết thành công");
      } else {
        await updatePost(postData as BlogPost, formData.content, formData.featuredImage || undefined);
        toast.success("Cập nhật bài viết thành công");
      }
      router.push("/admin/blog");
    } catch (error) {
      console.error('Error submitting blog post:', error)
      toast.error("Có lỗi xảy ra");
    }
  };

  if (loading && !isNewPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error && !isNewPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/admin/blog")}
          >
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {isNewPost ? "Tạo bài viết mới" : "Chỉnh sửa bài viết"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Mô tả ngắn</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="h-20"
              />
            </div>

            <div>
              <Label htmlFor="category">Danh mục</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="featuredImage">Ảnh bìa</Label>
              {formData.existingFeaturedImage && (
                <div className="mt-2 mb-4">
                  <Image 
                    src={formData.existingFeaturedImage} 
                    alt="Current featured image" 
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
              <Input
                id="featuredImage"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featuredImage: e.target.files?.[0] || null,
                  })
                }
              />
              <p className="text-sm text-muted-foreground mt-1">
                {formData.existingFeaturedImage 
                  ? "Chọn ảnh mới để thay thế ảnh hiện tại" 
                  : "Chọn ảnh bìa cho bài viết"}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, published: checked })
                }
              />
              <Label htmlFor="published">Xuất bản</Label>
            </div>
          </div>

          <div>
            <Label>Nội dung</Label>
            <div className="mt-2 border rounded-md">
              <Editor
                value={formData.content}
                onChange={(content) =>
                  setFormData({ ...formData, content })
                }
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/blog")}
            >
              Hủy
            </Button>
            <Button type="submit">
              {isNewPost ? "Tạo bài viết" : "Cập nhật"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}