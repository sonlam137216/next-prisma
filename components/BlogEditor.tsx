// components/BlogEditor.tsx
'use client';

import { useBlogStore } from '@/app/store/blogStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Eye,
  Save,
  Upload
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import RichTextEditor from './rich-text-editor';

export default function BlogEditor({
  post = null
}: {
  post?: {
    id?: number;
    title: string;
    slug: string;
    description: string;
    published: boolean;
    path?: string;
    featuredImage?: string;
    content?: string;
  } | null;
}) {
  const router = useRouter();
  const { createPost, updatePost, loading } = useBlogStore();
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [description, setDescription] = useState(post?.description || '');
  const [published, setPublished] = useState(post?.published || false);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>(
    post?.featuredImage || ''
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editorContent, setEditorContent] = useState(post?.content || '');
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes in the form
  useEffect(() => {
    const titleChanged = post?.title !== title;
    const slugChanged = post?.slug !== slug;
    const descriptionChanged = post?.description !== description;
    const publishedChanged = post?.published !== published;
    const contentChanged = post?.content !== editorContent;
    const imageChanged = featuredImageFile !== null;

    setHasChanges(
      titleChanged || 
      slugChanged || 
      descriptionChanged || 
      publishedChanged || 
      contentChanged || 
      imageChanged
    );
  }, [
    title, 
    slug, 
    description, 
    published, 
    editorContent, 
    featuredImageFile, 
    post
  ]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Only auto-generate slug if it's a new post or slug is empty
    if (!post?.id || slug === '') {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleFeaturedImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFeaturedImageFile(file);
    
    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      setFeaturedImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!title || !description) {
      alert('Please fill in all required fields');
      return;
    }
    
    const postData = {
      id: post?.id,
      title,
      slug,
      description,
      published,
      path: post?.path || '',
    };
    
    let success;
    
    if (post?.id) {
      // Update existing post
      success = await updatePost(postData, editorContent, featuredImageFile || undefined);
    } else {
      // Create new post
      success = await createPost(postData, editorContent, featuredImageFile || undefined);
    }
    
    if (success) {
      router.push('/admin/blog');
    }
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => hasChanges ? setIsExitDialogOpen(true) : router.push('/admin/blog')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => window.open(`/blog/preview/${slug}`, '_blank')}
            disabled={!slug}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={loading || !hasChanges}
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </div>
      
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter post title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-url-slug"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter post description"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="featuredImage">Featured Image</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Image
            </Button>
            <input
              type="file"
              id="featuredImage"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFeaturedImageChange}
            />
          </div>
          
          {featuredImagePreview && (
            <div className="relative h-48 border rounded-md overflow-hidden">
              <Image
                src={featuredImagePreview}
                alt="Featured image preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={published}
            onCheckedChange={setPublished}
          />
          <Label htmlFor="published">Published</Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <RichTextEditor 
            content={editorContent} 
            onChange={handleEditorChange} 
          />
        </div>
      </Card>
      
      {/* Exit Confirmation Dialog */}
      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave this page?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/admin/blog')}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}