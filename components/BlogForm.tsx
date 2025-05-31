// app/admin/blog/components/BlogForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Save, Undo2, CheckCircle } from 'lucide-react';
import { BlogPost, useBlogStore } from '@/app/store/blogStore';
import RichTextEditor from './rich-text-editor';
import { ImageUpload } from './ImageUpload';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const blogFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  slug: z.string().min(1, {
    message: "Slug is required.",
  }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens.",
  }),
  published: z.boolean().default(false),
  path: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  post?: BlogPost;
  isEditing?: boolean;
}

export default function BlogForm({ post, isEditing = false }: BlogFormProps) {
  const router = useRouter();
  const { createPost, updatePost } = useBlogStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [content, setContent] = useState(post?.content || '');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(
    post?.featuredImage || null
  );

  useEffect(() => {
    if (post?.content) {
      setContent(post.content);
    }
  }, [post?.content]);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: post?.title || '',
      description: post?.description || '',
      slug: post?.slug || '',
      published: post?.published || false,
      path: post?.path || '',
    },
  });

  // Auto-generate slug from title
  const title = form.watch('title');
  useEffect(() => {
    if (!isEditing && title && !form.getValues('slug')) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      form.setValue('slug', slug, { shouldValidate: true });
    }
  }, [title, form, isEditing]);

  const handleFeaturedImageChange = (file: File | null) => {
    setFeaturedImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFeaturedImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFeaturedImagePreview(post?.featuredImage || null);
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Prepare the blog post object
      const path = data.path || ''
      const blogPost: BlogPost = {
        ...data,
        path,
        id: post?.id ?? 1,
        category: '',
        readingTime: 0,
        createdAt: '',
        updatedAt: ''
      };
      
      let success = false;
      
      if (isEditing && post) {
        success = await updatePost(blogPost, content, featuredImage || undefined);
      } else {
        success = await createPost(blogPost, content, featuredImage || undefined);
      }
      
      if (success) {
        setSaveSuccess(true);
        
        // Redirect after a delay
        setTimeout(() => {
          router.push('/admin/blog');
        }, 1000);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Post' : 'Create New Post'}</CardTitle>
              <CardDescription>
                {isEditing 
                  ? 'Update your blog post content and settings' 
                  : 'Create a new blog post with rich text content'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of your post" 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be used for SEO and previews.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="post-url-slug" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be used in the URL: /blog/{field.value || 'post-slug'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <div className="border rounded-md bg-white">
                    <RichTextEditor 
                      content={content} 
                      onChange={setContent} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
              <CardDescription>
                Configure your post publishing options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Published</FormLabel>
                      <FormDescription>
                        Make this post public
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>Featured Image</FormLabel>
                <FormControl>
                  <ImageUpload 
                    onFileChange={handleFeaturedImageChange}
                    previewUrl={featuredImagePreview || undefined}
                    className="w-full aspect-video"
                  />
                </FormControl>
                <FormDescription>
                  This image will be displayed at the top of your post and in previews
                </FormDescription>
                <FormMessage />
              </FormItem>
              
              {isEditing && post?.path && (
                <FormField
                  control={form.control}
                  name="path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Path</FormLabel>
                      <FormControl>
                        <Input readOnly {...field} />
                      </FormControl>
                      <FormDescription>
                        Content file location on the server
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/blog')}
              >
                <Undo2 className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {saveSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  );
}