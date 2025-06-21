'use client';

import { useBlogStore } from "@/app/store/blogStore";
import { Product, useDashboardStore } from "@/app/store/dashboardStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronRight, Heart, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import HeroSlider from "./HeroSection";

export default function LandingPage() {
  const router = useRouter();
  const { 
    products, 
    fetchProducts, 
    fetchCategories, 
    categories, 
    loading,
    error 
  } = useDashboardStore();
  const { posts, fetchPosts, categories: blogCategories, fetchCategories: fetchBlogCategories, selectedCategory, setSelectedCategory } = useBlogStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [, setCurrentImageIndex] = useState(0);
  const imageSliderRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Sample collection images from Unsplash
  const collectionImages = [
    "/images/products/3c546079-f4f0-45ee-a9c5-1a9db8bd93ff.jpg", 
    "/images/products/6a1996e6-935d-4a97-b842-0a0090dd1ba7.png", 
    "/images/products/8b198eee-dc5f-4a2d-ac95-54c5d1eee83d.png", 
    "/images/products/16459445-0ffe-4404-bd17-b43dc94e9c2d.jpeg", 
  ];

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchProducts(1, 10),
          fetchPosts(1),
          fetchCategories(),
          fetchBlogCategories()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [fetchProducts, fetchCategories, fetchPosts, fetchBlogCategories]);

  // Update featured products when products change
  useEffect(() => {
    if (products && products.length > 0) {
      setFeaturedProducts(products);
    }
  }, [products]);

  // Auto transition for collection images
  useEffect(() => {
    imageSliderRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % collectionImages.length);
    }, 3000);

    return () => {
      if (imageSliderRef.current) {
        clearInterval(imageSliderRef.current);
      }
    };
  }, [collectionImages.length]);

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  // Update filtered products when products or category changes
  useEffect(() => {
    if (products && products.length > 0) {
      const filtered = products.filter(p => p.category?.id === selectedCategoryId);
      setFilteredProducts(filtered);
    }
  }, [products, selectedCategoryId]);

  // Add this new function to group products
  const getProductGroups = (products: Product[], groupSize: number) => {
    const groups = [];
    for (let i = 0; i < products.length; i += groupSize) {
      groups.push(products.slice(i, i + groupSize));
    }
    return groups;
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
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <HeroSlider />

      {/* 3 Small Banners Row */}
      <div className="w-full flex justify-center mt-6 mb-4">
        <div className="max-w-[1400px] w-full px-4 sm:px-5 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Banner 1 */}
            <div className="relative rounded-xl shadow-lg overflow-hidden h-[130px] transition-all duration-300 hover:scale-105">
              <Image
                src="/uploads/banner_next_slide_1.webp"
                alt="Free Shipping Banner"
                fill
                className="object-cover"
              />
            </div>
            {/* Banner 2 */}
            <div className="relative rounded-xl shadow-lg overflow-hidden h-[130px] transition-all duration-300 hover:scale-105">
              <Image
                src="/uploads/banner_next_slide_2.webp"
                alt="Gift Banner"
                fill
                className="object-cover"
              />
            </div>
            {/* Banner 3 */}
            <div className="relative rounded-xl shadow-lg overflow-hidden h-[130px] transition-all duration-300 hover:scale-105">
              <Image
                src="/uploads/banner_next_slide_3.webp"
                alt="Easy Return Banner"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Wrapper for all sections */}
      <div className="w-full overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* Featured Products Slider */}
          <section className="py-8 sm:py-12">
            <div className="w-full">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold">Sản phẩm mới nhất</h2>
                <Button variant="ghost" className="flex items-center gap-1 text-sm" asChild>
                  <Link href="/products">
                    Xem tất cả <ChevronRight size={14} />
                  </Link>
                </Button>
              </div>
              
              <Carousel className="w-full">
                <CarouselContent>
                  {featuredProducts.map((product) => (
                    <CarouselItem key={product.id} className="md:basis-1/5">
                      <Card 
                        className="group overflow-hidden hover:shadow-md transition-all duration-500 ease-in-out border border-gray-100 bg-white rounded-lg transform hover:scale-[1.02] cursor-pointer"
                        onClick={() => handleProductClick(product.id)}
                      >
                        <div className="relative h-40 sm:h-48">
                          <div className="absolute top-2 right-2 z-10 flex gap-1">
                            <Button 
                              size="icon" 
                              variant="secondary" 
                              className="rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                            >
                              <Heart size={14} />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="secondary" 
                              className="rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                            >
                              <Search size={14} />
                            </Button>
                          </div>
                          
                          <Image 
                            src={product.images?.[0]?.url || `/api/placeholder/${400 + product.id}/${400 + product.id}`}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                          />
                        </div>
                        
                        <CardHeader className="py-2 px-3">
                          <div className="flex justify-between items-center mb-1">
                            <Badge variant="outline" className="font-normal text-xs transition-all duration-300 group-hover:bg-primary/10">
                              {product.category?.name || "Category"}
                            </Badge>
                            <Badge variant="secondary" className="font-medium text-sm transition-all duration-300 group-hover:bg-primary">
                              ${product.price}
                            </Badge>
                          </div>
                          <CardTitle className="text-sm transition-all duration-300 group-hover:text-primary">
                            {product.name}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="py-0 px-3">
                          <CardDescription className="line-clamp-1 text-gray-600 text-xs transition-all duration-300 group-hover:text-gray-800">
                            {product.description || "No description available"}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="text-black hover:text-primary border-black hover:border-primary" />
                <CarouselNext className="text-black hover:text-primary border-black hover:border-primary" />
              </Carousel>
            </div>
          </section>

          {/* Collections Section */}
          <section className="py-2 sm:py-4 mb-16">
            <div className="w-full">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8">Bộ sưu tập</h2>
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-12">
                {/* Left side - Image Slider */}
                <div className="relative h-[750px] w-[650px] sm:w-[650px] sm:h-[750px] overflow-hidden rounded-lg">
                  <Carousel className="w-full h-full">
                    <CarouselContent>
                      {collectionImages.map((image, index) => (
                        <CarouselItem key={index} className="h-full">
                          <div className="relative h-full w-full">
                            <Image
                              src={image}
                              alt={`Collection ${index + 1}`}
                              fill
                              className="object-cover transition-transform duration-700 ease-in-out"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="text-white hover:text-primary border-white hover:border-primary" />
                    <CarouselNext className="text-white hover:text-primary border-white hover:border-primary" />
                  </Carousel>
                </div>

                {/* Right side - Product Grid */}
                <div className="flex-1 ml-4">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {getProductGroups(featuredProducts, 4).map((productGroup, groupIndex) => (
                        <CarouselItem key={groupIndex} className="md:basis-1/1">
                          <div className="grid grid-cols-2 gap-8 h-full">
                            {productGroup.map((product) => (
                              <Card 
                                key={product.id}
                                className="group overflow-hidden hover:shadow-md p-0 transition-all duration-500 ease-in-out border-0 bg-white rounded-lg transform hover:scale-[1.02] h-[340px] cursor-pointer"
                                onClick={() => handleProductClick(product.id)}
                              >
                                <div className="relative h-[340px]">
                                  <Image 
                                    src={product.images?.[0]?.url || `/api/placeholder/${400 + product.id}/${400 + product.id}`}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                  />
                                </div>
                                <CardHeader className="py-2 px-3">
                                  <CardTitle className="text-sm transition-all duration-300 group-hover:text-primary line-clamp-1">
                                    {product.name}
                                  </CardTitle>
                                  <Badge variant="secondary" className="font-medium text-sm transition-all duration-300 group-hover:bg-primary mt-1">
                                    ${product.price}
                                  </Badge>
                                </CardHeader>
                              </Card>
                            ))}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="text-black hover:text-primary border-black hover:border-primary" />
                    <CarouselNext className="text-black hover:text-primary border-black hover:border-primary" />
                  </Carousel>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Category Products Section - Full Width */}
      <section className="relative py-4 w-full">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 h-[600px] sm:h-[800px]">
          <Image
            src="https://theme.hstatic.net/200000689681/1001138369/14/bg_home_collection_5_1.jpg?v=9971"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex justify-end">
              <div className="w-full max-w-[1000px]">
                {/* Section Title */}
                <div className="text-right mb-6 sm:mb-12">
                  <Badge variant="outline" className="text-white border-white mb-2 sm:mb-4">Danh mục nổi bật</Badge>
                  <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
                    Sản phẩm theo danh mục
                  </h2>
                </div>

                {/* Category Filter Buttons */}
                <div className="flex justify-end mb-6 sm:mb-12 space-x-2 sm:space-x-4">
                  <Button
                    variant="outline"
                    className={`${
                      selectedCategoryId === 4
                        ? 'bg-black text-white border-black hover:bg-black/90' 
                        : 'bg-gray-100 text-black border-gray-200 hover:bg-gray-200'
                    } transition-all duration-300 text-xs sm:text-sm`}
                    onClick={() => setSelectedCategoryId(4)}
                  >
                    {categories.find(c => c.id === 4)?.name || 'Category 1'}
                  </Button>
                  <Button
                    variant="outline"
                    className={`${
                      selectedCategoryId === 5 
                        ? 'bg-black text-white border-black hover:bg-black/90' 
                        : 'bg-gray-100 text-black border-gray-200 hover:bg-gray-200'
                    } transition-all duration-300 text-xs sm:text-sm`}
                    onClick={() => setSelectedCategoryId(5)}
                  >
                    {categories.find(c => c.id === 5)?.name || 'Category 2'}
                  </Button>
                </div>

                {/* Products Carousel */}
                <Carousel className="w-full">
                  <CarouselContent>
                    {filteredProducts.map((product) => (
                      <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                          <div className="relative h-[200px] sm:h-[300px]">
                            <Image
                              src={product.images?.[0]?.url || `/api/placeholder/${400 + product.id}/${400 + product.id}`}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                          </div>
                          <CardHeader className="py-3 sm:py-4 px-3 sm:px-4">
                            <CardTitle className="text-sm sm:text-base transition-colors group-hover:text-primary">
                              {product.name}
                            </CardTitle>
                            <Badge variant="secondary" className="font-medium text-xs sm:text-sm transition-colors group-hover:bg-primary mt-2">
                              ${product.price}
                            </Badge>
                          </CardHeader>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="text-white hover:text-primary border-white hover:border-primary" />
                  <CarouselNext className="text-white hover:text-primary border-white hover:border-primary" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Banners Section */}
      <section className="py-12 sm:py-16 bg-gray-50 mt-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="#" className="block group">
              <div className="relative overflow-hidden rounded-lg shadow-lg transform group-hover:-translate-y-1 transition-transform duration-300">
                <Image
                  src="/blog-content/GARNET-LUU-DO-CHARM-PHUC-1748676755615.jpg"
                  alt="Info Banner 1"
                  width={400}
                  height={500}
                  className="w-full h-auto object-cover aspect-[3/4]"
                />
              </div>
            </Link>
            <Link href="#" className="block group">
              <div className="relative overflow-hidden rounded-lg shadow-lg transform group-hover:-translate-y-1 transition-transform duration-300">
                <Image
                  src="/blog-content/GARNET-LUU-DO-CHARM-PHUC-1748676989010.jpg"
                  alt="Info Banner 2"
                  width={400}
                  height={500}
                  className="w-full h-auto object-cover aspect-[3/4]"
                />
              </div>
            </Link>
            <Link href="#" className="block group">
              <div className="relative overflow-hidden rounded-lg shadow-lg transform group-hover:-translate-y-1 transition-transform duration-300">
                <Image
                  src="/blog-content/MOONSTONE-VUONG-MAY-BAC-WEB-TIKTOK-1748677150083.jpg"
                  alt="Info Banner 3"
                  width={400}
                  height={500}
                  className="w-full h-auto object-cover aspect-[3/4]"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Content Wrapper for remaining sections */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6">
        {/* Blog Posts / Latest News */}
        <section className="py-8 sm:py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">BÀI VIẾT & SỰ KIỆN NỔI BẬT</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {blogCategories.filter(c => c !== 'Tất cả').map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`transition-all duration-300 rounded-full px-4 sm:px-6 ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {posts.map((post) => (
                <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3 p-4">
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <Card className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      <div className="relative h-52 w-full">
                        <Image
                          src={post.featuredImage || `/api/placeholder/400/250`}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-gray-600 line-clamp-3 text-sm">
                          {post.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2 text-black hover:text-primary border-black hover:border-primary" />
            <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2 text-black hover:text-primary border-black hover:border-primary" />
          </Carousel>
          
          <div className="mt-12 text-center">
            <Button asChild className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-3">
              <Link href="/blog">
                Xem tất cả
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}