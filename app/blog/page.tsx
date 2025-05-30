// app/blog/page.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBlogStore } from "@/app/store/blogStore";
import { format } from "date-fns";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogClient } from "./BlogClient";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Blog & Tin Tức | Gem Store",
  description: "Khám phá những bài viết mới nhất về phong thủy, đá quý và những câu chuyện thú vị từ chúng tôi",
  openGraph: {
    title: "Blog & Tin Tức | Gem Store",
    description: "Khám phá những bài viết mới nhất về phong thủy, đá quý và những câu chuyện thú vị từ chúng tôi",
    type: "website",
  },
};

// Server Component
export default async function BlogPage() {
  console.log('Debug - BlogPage: Starting to fetch data');
  const blogStore = useBlogStore.getState();
  
  try {
    // Fetch initial data
    console.log('Debug - BlogPage: Fetching initial data');
    await Promise.all([
      blogStore.fetchPosts(1),
      blogStore.fetchFeaturedPost(),
      blogStore.fetchCategories(),
    ]);
    console.log('Debug - BlogPage: Initial data fetched successfully');
  } catch (error) {
    console.error('Debug - BlogPage: Error fetching initial data:', error);
  }

  const posts = blogStore.posts;
  const featuredPost = blogStore.featuredPost;
  const categories = blogStore.categories;
  const pagination = blogStore.pagination;

  console.log('Debug - BlogPage: State after fetching:', {
    postsCount: posts.length,
    hasFeaturedPost: !!featuredPost,
    categoriesCount: categories.length,
    pagination,
  });

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-4 sm:px-5 lg:px-6">
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

      {/* Client Component for Interactive Features */}
      <BlogClient 
        initialPosts={posts} 
        initialCategories={categories}
        initialPagination={pagination}
      />
    </div>
  );
}