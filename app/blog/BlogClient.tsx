"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { format } from "date-fns";
import { ArrowRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description?: string;
  featuredImage?: string;
  createdAt: string;
  readingTime: number;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalPages: number;
  totalPosts: number;
}

interface BlogClientProps {
  initialPosts: BlogPost[];
  initialCategories: string[];
  initialPagination: Pagination;
}

export function BlogClient({ initialPosts, initialCategories, initialPagination }: BlogClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [categories] = useState<string[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [loading, setLoading] = useState(false);
  const [, setPagination] = useState<Pagination>(initialPagination);

  // Fetch data on client side if initial data is empty
  useEffect(() => {
    if (posts.length === 0) {
      handleCategoryChange("Tất cả");
    }
  }, []);

  const handleCategoryChange = async (category: string) => {
    console.log('Debug - Changing category to:', category);
    setSelectedCategory(category);
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: "1",
        pageSize: "9",
        ...(category !== "Tất cả" && { category }),
      });

      console.log('Debug - Fetching posts with params:', params.toString());
      const response = await axios.get(`/api/blog?${params.toString()}`);
      console.log('Debug - Received response:', response.data);

      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Debug - Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Categories */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === selectedCategory ? "default" : "outline"}
              className="rounded-full"
              onClick={() => handleCategoryChange(category)}
              disabled={loading}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Card key={post.id} className="border-none shadow-lg overflow-hidden group">
            <div className="relative h-48">
              <Image
                src={post.featuredImage || `/api/placeholder/400/300?${post.id}`}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    {format(new Date(post.createdAt), "dd/MM/yyyy")}
                  </span>
                </div>
              </div>
              <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <Button
                variant="ghost"
                className="p-0 h-auto hover:bg-transparent group-hover:text-primary"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-2"
                >
                  Đọc thêm
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p>Loading...</p>
        </div>
      )}

      {/* No Posts State */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-8">
          <p>No posts found.</p>
        </div>
      )}
    </>
  );
} 