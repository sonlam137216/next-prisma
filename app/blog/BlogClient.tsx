"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlogStore, BlogPost } from "@/app/store/blogStore";
import { format } from "date-fns";
import { ArrowRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface BlogClientProps {
  initialPosts: BlogPost[];
  initialCategories: string[];
  initialPagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalPosts: number;
  };
}

export function BlogClient({ initialPosts, initialCategories, initialPagination }: BlogClientProps) {
  const {
    posts,
    categories,
    selectedCategory,
    loading,
    pagination,
    setSelectedCategory,
    fetchPosts,
  } = useBlogStore();

  // Initialize store with initial data
  useEffect(() => {
    useBlogStore.setState({
      posts: initialPosts,
      categories: initialCategories,
      pagination: initialPagination,
    });
  }, [initialPosts, initialCategories, initialPagination]);

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    await fetchPosts(1, category === "Tất cả" ? undefined : category);
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    await fetchPosts(newPage, selectedCategory === "Tất cả" ? undefined : selectedCategory);
  };

  return (
    <>
      {/* Categories */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            variant={selectedCategory === "Tất cả" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => handleCategoryChange("Tất cả")}
            disabled={loading}
          >
            Tất cả
          </Button>
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
          <p>Không có bài viết nào trong danh mục này.</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === pagination.page ? "default" : "outline"}
                onClick={() => handlePageChange(pageNum)}
                className="w-10 h-10"
              >
                {pageNum}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
} 