'use client';

// app/blog/page.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlogClient } from "./BlogClient";
import { useEffect, useState, Suspense } from "react";
import { useBlogStore } from "@/app/store/blogStore";
import { useSearchParams } from "next/navigation";

function BlogContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { 
    posts, 
    categories, 
    pagination, 
    featuredPost,
    fetchPosts,
    fetchCategories,
    fetchFeaturedPost
  } = useBlogStore();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || "Tất cả";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchPosts(1, activeCategory === "Tất cả" ? undefined : activeCategory),
          fetchCategories(),
          fetchFeaturedPost(),
        ]);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchPosts, fetchCategories, fetchFeaturedPost, activeCategory]);

  // Lấy 4 bài mới nhất không trùng featuredPost
  const topPosts = posts
    .filter((post) => post.id !== featuredPost?.id)
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto py-12 px-4 sm:px-5 lg:px-6">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto py-12 px-4 sm:px-5 lg:px-6">
      {/* Breadcrumb + Title */}
      <div className="mb-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary mb-4 text-left">
          Tin tức
        </h1>
      </div>

      {/* Featured + Top 4 Posts Grid - cân đối chiều cao */}
      <div className="grid md:grid-cols-3 gap-4 mb-16 h-[420px]">
        {/* Featured Post (2/3 width on desktop) */}
        {featuredPost && (
          <div className="md:col-span-2 h-full">
            <Link href={`/blog/${featuredPost.slug}`} className="block h-full group">
              <div className="relative w-full h-full rounded-none overflow-hidden">
                <Image
                  src={featuredPost.featuredImage || "/api/placeholder/800/600"}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  priority
                  style={{objectPosition: 'center'}}
                />
                <div className="absolute inset-0 bg-black/40" />
                {/* Label */}
                <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded font-semibold uppercase tracking-wide">
                  Tin tức
                </div>
                {/* Title & Date */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg">
                    {featuredPost.title}
                  </h2>
                  <div className="text-sm text-white flex items-center gap-2 drop-shadow-lg">
                    <CalendarDays className="w-4 h-4" />
                    <span>{format(new Date(featuredPost.createdAt), "dd/MM/yyyy")}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
        {/* Top 4 Posts (2x2 grid trong 1 cột) */}
        <div className="h-full grid grid-rows-2 grid-cols-2 gap-2">
          {topPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="relative w-full h-full rounded-none overflow-hidden group"
            >
              <div className="relative w-full h-full">
                <Image
                  src={post.featuredImage || "/api/placeholder/400/300"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  style={{objectPosition: 'center'}}
                />
                <div className="absolute inset-0 bg-black/40" />
                {/* Label */}
                <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded font-semibold uppercase tracking-wide">
                  Tin tức
                </div>
                {/* Title & Date */}
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <div className="text-base font-bold mb-1 text-white drop-shadow-lg line-clamp-2">
                    {post.title}
                  </div>
                  <div className="text-xs text-white flex items-center gap-1 drop-shadow-lg">
                    <CalendarDays className="w-3 h-3" />
                    <span>{format(new Date(post.createdAt), "dd/MM/yyyy")}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Client Component for Interactive Features */}
      <BlogClient 
        initialPosts={posts} 
        initialCategories={categories}
        initialPagination={pagination}
        activeCategory={activeCategory}
      />
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogContent />
    </Suspense>
  );
}