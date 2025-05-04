'use client';

import { useBlogStore } from "@/app/store/blogStore";
import { Product, useDashboardStore } from "@/app/store/dashboardStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Heart, Mail, Search, ShoppingCart, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import HeroSlider from "./HeroSection";
import { useRouter } from 'next/navigation';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

export default function LandingPage() {
  const router = useRouter();
  const { products, fetchProducts, fetchCategories, currentPage, totalPages, categories, addToCart, toggleCart } = useDashboardStore();
  const { posts, fetchPosts } = useBlogStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
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

  useEffect(() => {
    fetchProducts(1, 8); // Fetch first page with 8 items
    fetchPosts();
    fetchCategories();
  }, [fetchProducts, fetchCategories, fetchPosts]);

  useEffect(() => {
    if (products.length > 0) {
      setFeaturedProducts(products);
      setTrending(products.sort((a, b) => b.price - a.price).slice(0, 3));
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
  }, []);

  const handleSubscribe = (e: any) => {
    e.preventDefault();
    if (email.trim() !== "") {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  const nextProduct = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % (featuredProducts.length - 3));
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const prevProduct = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + (featuredProducts.length - 3)) % (featuredProducts.length - 3));
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const nextCollectionProducts = () => {
    setCurrentProductIndex((prev) => (prev + 4) % 8);
  };

  const prevCollectionProducts = () => {
    setCurrentProductIndex((prev) => (prev - 4 + 8) % 8);
  };

  const visibleProducts = featuredProducts.slice(currentIndex, currentIndex + 4);
  const collectionProducts = featuredProducts.slice(currentProductIndex, currentProductIndex + 4);

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(products.filter(p => p.category?.id === selectedCategoryId));
    }
  }, [products, selectedCategoryId]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <HeroSlider />

      {/* Content Wrapper for all sections */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6">
        {/* Featured Products Slider */}
        <section className="py-14 sm:py-16">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold">Sản phẩm mới nhất</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={prevProduct}
                  className="rounded-full hover:bg-primary/10 transition-colors"
                  disabled={isAnimating}
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={nextProduct}
                  className="rounded-full hover:bg-primary/10 transition-colors"
                  disabled={isAnimating}
                >
                  <ChevronRightIcon size={20} />
                </Button>
              </div>
            </div>
            
            <div className="relative overflow-hidden">
              <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 transition-transform duration-1000 ease-in-out ${
                isAnimating ? 'transform -translate-x-1' : ''
              }`}>
                {visibleProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="group overflow-hidden hover:shadow-md transition-all duration-300 border-0 bg-white rounded-lg transform hover:scale-[1.02] cursor-pointer"
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
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    <CardHeader className="py-2 px-3">
                      <div className="flex justify-between items-center mb-1">
                        <Badge variant="outline" className="font-normal text-xs transition-colors group-hover:bg-primary/10">
                          {product.category?.name || "Category"}
                        </Badge>
                        <Badge variant="secondary" className="font-medium text-sm transition-colors group-hover:bg-primary">
                          ${product.price}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm transition-colors group-hover:text-primary">
                        {product.name}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="py-0 px-3">
                      <CardDescription className="line-clamp-1 text-gray-600 text-xs transition-colors group-hover:text-gray-800">
                        {product.description || "No description available"}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="py-14 sm:py-16">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Bộ sưu tập</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left side - Image Slider */}
              <div className="relative h-[500px] overflow-hidden rounded-lg">
                {collectionImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Collection ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {collectionImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Right side - Product Grid */}
              <div className="relative h-[500px]">
                <div className="grid grid-cols-2 gap-4 h-full">
                  {collectionProducts.map((product) => (
                    <Card 
                      key={product.id} 
                      className="group overflow-hidden hover:shadow-md transition-all duration-300 border-0 bg-white rounded-lg transform hover:scale-[1.02] h-full cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="relative h-[200px] -mt-1">
                        <Image 
                          src={product.images?.[0]?.url || `/api/placeholder/${400 + product.id}/${400 + product.id}`}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-sm transition-colors group-hover:text-primary">
                          {product.name}
                        </CardTitle>
                        <Badge variant="secondary" className="font-medium text-sm transition-colors group-hover:bg-primary">
                          ${product.price}
                        </Badge>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                  <ChevronLeft 
                    size={24} 
                    className="text-white bg-black/50 p-1 rounded-full cursor-pointer hover:bg-black/70 transition-colors"
                    onClick={prevCollectionProducts}
                  />
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <ChevronRightIcon 
                    size={24} 
                    className="text-white bg-black/50 p-1 rounded-full cursor-pointer hover:bg-black/70 transition-colors"
                    onClick={nextCollectionProducts}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Category Products Section - Full Width */}
      <section className="relative py-10">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 h-[800px]">
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
          <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6">
            <div className="flex justify-end">
              <div className="w-full max-w-[1000px]">
                {/* Section Title */}
                <div className="text-right mb-12">
                  <Badge variant="outline" className="text-white border-white mb-4">Danh mục nổi bật</Badge>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                    Sản phẩm theo danh mục
                  </h2>
                </div>

                {/* Category Filter Buttons */}
                <div className="flex justify-end mb-12 space-x-4">
                  <Button
                    variant="outline"
                    className={`${
                      selectedCategoryId === 1 
                        ? 'bg-black text-white border-black hover:bg-black/90' 
                        : 'bg-gray-100 text-black border-gray-200 hover:bg-gray-200'
                    } transition-all duration-300`}
                    onClick={() => setSelectedCategoryId(1)}
                  >
                    {categories.find(c => c.id === 1)?.name || 'Category 1'}
                  </Button>
                  <Button
                    variant="outline"
                    className={`${
                      selectedCategoryId === 2 
                        ? 'bg-black text-white border-black hover:bg-black/90' 
                        : 'bg-gray-100 text-black border-gray-200 hover:bg-gray-200'
                    } transition-all duration-300`}
                    onClick={() => setSelectedCategoryId(2)}
                  >
                    {categories.find(c => c.id === 2)?.name || 'Category 2'}
                  </Button>
                </div>

                {/* Products Carousel */}
                <Carousel className="w-full">
                  <CarouselContent>
                    {filteredProducts.map((product) => (
                      <CarouselItem key={product.id} className="md:basis-1/3">
                        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                          <div className="relative h-[300px]">
                            <Image
                              src={product.images?.[0]?.url || `/api/placeholder/${400 + product.id}/${400 + product.id}`}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                          </div>
                          <CardHeader className="py-4 px-4">
                            <CardTitle className="text-base transition-colors group-hover:text-primary">
                              {product.name}
                            </CardTitle>
                            <Badge variant="secondary" className="font-medium text-sm transition-colors group-hover:bg-primary mt-2">
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

      {/* Content Wrapper for remaining sections */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6">
        {/* Blog Posts / Latest News */}
        <section className="py-14 sm:py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Tin tức & Blog</h2>
            <Button variant="ghost" className="flex items-center gap-1 text-sm">
              Xem tất cả <ChevronRight size={14} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Featured blog post */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow border-0 col-span-1 sm:col-span-2 lg:col-span-3">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                <div className="relative h-48 lg:h-auto lg:col-span-2">
                  <Image 
                    src={posts[0]?.featuredImage || `/api/placeholder/800/400`}
                    alt={posts[0]?.title || "Featured blog post"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary text-white">
                      {new Date(posts[0]?.createdAt || new Date()).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {posts[0]?.title || "Featured blog post title"}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                    {posts[0]?.description || "This is a placeholder for your featured blog post description."}
                  </p>
                  <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 flex items-center gap-1 text-sm w-fit">
                    Đọc thêm <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Regular blog posts */}
            {posts.slice(1, 4).map((post, index) => (
              <Card key={post?.id || index} className="overflow-hidden hover:shadow-md transition-shadow border-0">
                <div className="relative h-40">
                  <Image 
                    src={post?.featuredImage || `/api/placeholder/${500 + index}/${350 + index}`}
                    alt={post?.title || `Blog post ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="top-10 left-3">
                    <Badge className="bg-primary text-white text-xs">
                      {new Date(post?.createdAt || new Date()).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base line-clamp-2">
                    {post?.title || `Blog post title ${index + 1}`}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="py-0 px-4">
                  <CardDescription className="line-clamp-2 text-xs">
                    {post?.description || "This is a placeholder for your blog post description."}
                  </CardDescription>
                </CardContent>
                
                <CardFooter className="py-3 px-4">
                  <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 flex items-center gap-1 text-xs">
                    Đọc thêm <ChevronRight size={14} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}