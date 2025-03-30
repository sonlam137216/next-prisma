// app/admin/blog/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Loader2, ArrowLeft, Edit, Clock, Calendar, Eye } from 'lucide-react';
import { useBlogStore, BlogPost } from '@/app/store/blogStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ViewBlogPage() {
  const params = useParams();
  const router = useRouter();
  const { posts, fetchPostById, fetchPosts, currentPost } = useBlogStore();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      
      if (posts.length === 0) {
        await fetchPosts();
      }
      
      const postId = params.id as unknown as number
      console.log({ postId })
      await fetchPostById(postId);
      
      if (currentPost) {
        setPost(currentPost);
      } else {
        router.push('/admin/blog');
      }
      
      setLoading(false);
    };
    
    loadPost();
  }, [params.id, fetchPostById, fetchPosts, posts.length, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-2 text-muted-foreground">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push('/admin/blog')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all posts
        </Button>
        
        <Link href={`/admin/blog/${post.id}/edit`}>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          {post.featuredImage && (
            <div className="aspect-video w-full overflow-hidden rounded-t-md">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          
          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant={post.published ? "default" : "outline"}>
                {post.published ? "Published" : "Draft"}
              </Badge>
            </div>
            <CardTitle className="text-2xl md:text-3xl">{post.title}</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="prose max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Post Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span>{format(new Date(post.createdAt!), 'PPP')}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Updated:</span>
              <span>{format(new Date(post.updatedAt!), 'PPP')}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Visibility:</span>
              <span>{post.published ? 'Published' : 'Draft'}</span>
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-1">Permalink:</p>
              <code className="text-xs bg-muted p-1 rounded">
                /blog/{post.slug}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}