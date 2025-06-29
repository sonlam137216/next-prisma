"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlogStore, BlogPost } from "@/app/store/blogStore";
import { format } from "date-fns";
import { ArrowRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface BlogClientProps {
  initialPosts: BlogPost[];
  initialCategories: string[];
  initialPagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalPosts: number;
  };
  activeCategory: string;
}

export function BlogClient({ initialPosts, initialCategories, initialPagination, activeCategory }: BlogClientProps) {
  const {
    posts,
    categories,
    selectedCategory,
    loading,
    pagination,
    fetchPosts,
  } = useBlogStore();
  const router = useRouter();

  // Initialize store with initial data
  useEffect(() => {
    console.log('Debug - BlogClient: Initializing with data:', {
      postsCount: initialPosts.length,
      categoriesCount: initialCategories.length,
      pagination: initialPagination
    });
    
    useBlogStore.setState({
      posts: initialPosts,
      categories: initialCategories,
      pagination: initialPagination,
      selectedCategory: activeCategory,
      loading: false
    });
  }, [initialPosts, initialCategories, initialPagination, activeCategory]);

  const handleCategoryChange = (category: string) => {
    const newUrl = category === "Tất cả" ? '/blog' : `/blog?category=${encodeURIComponent(category)}`;
    router.push(newUrl, { scroll: false });
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    await fetchPosts(newPage, selectedCategory === "Tất cả" ? undefined : selectedCategory);
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Danh sách bài viết */}
      <div className="md:col-span-2 flex flex-col gap-8">
        {posts.map((post) => (
          <div key={post.id} className="flex flex-row gap-6 items-start group">
            {/* Ảnh nhỏ bên trái */}
            <Link href={`/blog/${post.slug}`} className="block w-48 min-w-[160px] aspect-[4/3] relative rounded overflow-hidden flex-shrink-0">
              <Image
                src={post.featuredImage || `/api/placeholder/400/300?${post.id}`}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            {/* Nội dung bên phải */}
            <div className="flex-1">
              <Link href={`/blog/${post.slug}`}> 
                <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
              </Link>
              <div className="flex items-center gap-4 mb-2">
                <span className="bg-black/80 text-white text-xs px-2 py-1 rounded font-semibold uppercase tracking-wide">{post.category}</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  {format(new Date(post.createdAt), "dd/MM/yyyy")}
                </span>
              </div>
              <div className="text-muted-foreground mb-2 line-clamp-3">
                {post.description || ''}
              </div>
              <Link href={`/blog/${post.slug}`} className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
                Đọc thêm <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
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
      </div>
      {/* Sidebar */}
      <div className="flex flex-col gap-8">
        {/* Social connect */}
        <div className="border rounded-lg p-6 bg-white">
          <div className="text-xl font-bold mb-4 text-center">Kết Nối Với PNJ</div>
          <div className="flex justify-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">1,187,586</span>
              <span className="text-xs text-muted-foreground">Fans</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">32,600</span>
              <span className="text-xs text-muted-foreground">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">72,700</span>
              <span className="text-xs text-muted-foreground">Subscribers</span>
            </div>
          </div>
        </div>
        {/* Banner quảng cáo */}
        <div className="rounded-lg overflow-hidden">
          <Image
            src="/uploads/1748620572952-CAM-THACH-XANH-CHARM-LOC.jpg"
            alt="Banner quảng cáo PNJ"
            width={300}
            height={700}
            className="w-full h-auto object-cover"
            style={{objectPosition: 'center'}}
          />
        </div>
        {/* Bài viết mới nhất */}
        <div className="bg-white rounded-lg p-4">
          <div className="text-xl font-bold mb-4">Bài viết mới</div>
          <div className="flex flex-col gap-4">
            {posts.slice(0, 3).map((post) => (
              <div key={post.id} className="flex items-start gap-3">
                <Link href={`/blog/${post.slug}`} className="block w-16 h-12 min-w-[64px] relative rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={post.featuredImage || `/api/placeholder/400/300?${post.id}`}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/blog/${post.slug}`} className="font-semibold text-base hover:text-primary line-clamp-2">
                    {post.title}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(post.createdAt), "dd/MM/yyyy")}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {post.description || ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 