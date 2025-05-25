// app/blog/page.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { useBlogStore } from "@/app/store/blogStore";
import { format } from "date-fns";

export default function BlogPage() {
  const {
    posts,
    featuredPost,
    categories,
    selectedCategory,
    loading,
    error,
    pagination,
    setSelectedCategory,
    fetchPosts,
    fetchFeaturedPost,
    fetchCategories,
  } = useBlogStore();

  useEffect(() => {
    fetchPosts(1);
    fetchFeaturedPost();
    fetchCategories();
  }, [fetchPosts, fetchFeaturedPost, fetchCategories]);

  const handlePageChange = (page: number) => {
    fetchPosts(page, selectedCategory === "Tất cả" ? undefined : selectedCategory);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto py-12 px-4 md:px-6">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
          Blog & Tin Tức
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Khám phá những bài viết mới nhất về phong thủy, đá quý và những câu
          chuyện thú vị từ chúng tôi
        </p>
        <Separator className="my-8" />
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-16">
          <Card className="border-none shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative h-[400px] md:h-full">
                <Image
                  src={featuredPost.featuredImage || "/api/placeholder/800/600"}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>
                      {format(new Date(featuredPost.createdAt), "dd/MM/yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readingTime} phút đọc</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-muted-foreground mb-6">
                  {featuredPost.description}
                </p>
                <Button asChild className="w-fit">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    Đọc thêm
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Categories */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-4 justify-center">
          {["Tất cả", ...categories].map((category) => (
            <Button
              key={category}
              variant={category === selectedCategory ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setSelectedCategory(category)}
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

      {/* Pagination */}
      <div className="mt-12 flex justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          <span className="sr-only">Previous page</span>
          <ArrowRight className="h-4 w-4 rotate-180" />
        </Button>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
          (page) => (
            <Button
              key={page}
              variant={page === pagination.page ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="icon"
          disabled={pagination.page === pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          <span className="sr-only">Next page</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}