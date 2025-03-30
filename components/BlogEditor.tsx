// app/components/BlogEditor.tsx
'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useBlogStore } from '@/app/store/blogStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { 
  Image as ImageIcon, 
  Save, 
  ArrowLeft, 
  Eye, 
  Heading1, 
  Heading2, 
  Heading3, 
  ListOrdered, 
  List, 
  Bold, 
  Italic, 
  Link, 
  Code, 
  Upload
} from 'lucide-react';

// Simple MDX editor with markdown toolbar
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
  const [content, setContent] = useState(post?.content || '');
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>(
    post?.featuredImage || ''
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Insert markdown syntax at cursor position
  const insertMarkdown = (syntax: string, placeholder = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);
    
    let newText;
    if (selectedText) {
      newText = beforeText + syntax.replace(placeholder, selectedText) + afterText;
    } else {
      newText = beforeText + syntax + afterText;
    }
    
    setContent(newText);
    
    // Focus back to the textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      const cursorPosition = placeholder 
        ? start + syntax.indexOf(placeholder) 
        : start + syntax.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  };

  const handleSave = async () => {
    if (!title || !description || !content) {
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
      success = await updatePost(postData, content, featuredImageFile || undefined);
    } else {
      // Create new post
      success = await createPost(postData, content, featuredImageFile || undefined);
    }
    
    if (success) {
      router.push('/admin/blog');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsExitDialogOpen(true)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => window.open(`/blog/preview/${slug}`, '_blank')}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={loading}
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
          <Label htmlFor="content">Content (MDX)</Label>
          
          <div className="flex flex-wrap gap-2 mb-2">
            <Button
              variant="outline" 
              size="sm"
              onClick={() => insertMarkdown('# heading', 'heading')}
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" 
              size="sm"
              onClick={() => insertMarkdown('## heading', 'heading')}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" 
              size="sm"
              onClick={() => insertMarkdown('### heading', 'heading')}
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" 
              size="sm"
              onClick={() => insertMarkdown('**bold**', 'bold')}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" 
              size="sm"
              onClick={() => insertMarkdown('*italic*', 'italic')}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" 
              size="sm"
              onClick={() => insertMarkdown('[link text](url)', 'link text')}
              title="Link"
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" 
              size="sm"
              onClick={() => insertMarkdown('- list item', 'list item')}
              title="Bulleted List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" 
              size="sm"
              onClick={() => insertMarkdown('1. list item', 'list item')}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" 
              size="sm"
              onClick={() => insertMarkdown('`code`', 'code')}
              title="Inline Code"
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" 
              size="sm"
              onClick={() => insertMarkdown('![alt text](image-url)', 'alt text')}
              title="Image"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <Textarea 
            id="content"
            ref={contentTextareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content in MDX format..."
            rows={20}
            className="font-mono"
          />
        </div>
      </Card>
      
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