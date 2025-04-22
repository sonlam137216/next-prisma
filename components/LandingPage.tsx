'use client';

import { useBlogStore } from "@/app/store/blogStore";
import { Product, useDashboardStore } from "@/app/store/dashboardStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Heart, Mail, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import HeroSlider from "./HeroSection";

export default function LandingPage() {
  const { products, categories, fetchProducts, fetchCategories } = useDashboardStore();
  const { posts, fetchPosts } = useBlogStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  console.log(posts)

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchPosts();
  }, [fetchProducts, fetchCategories, fetchPosts]);

  useEffect(() => {
    if (products.length > 0) {
      // Get 6 featured products
      setFeaturedProducts(products.slice(0, 6));
      // Get 3 trending products (could be most expensive or newest)
      setTrending(products.sort((a, b) => b.price - a.price).slice(0, 3));
    }
  }, [products]);

  const handleSubscribe = (e: any) => {
    e.preventDefault();
    if (email.trim() !== "") {
      setIsSubscribed(true);
      setEmail("");
      // You would typically send this to your API
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <HeroSlider />

      {/* Content Wrapper for all sections */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6">
        {/* Categories Section */}
        <section className="py-14 sm:py-16 bg-white">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Shop by Category</h2>
            <Button variant="ghost" className="flex items-center gap-1 text-sm">
              View All <ChevronRight size={14} />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* First large category */}
            <div className="col-span-2 row-span-2 relative h-64 sm:h-72 group overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
              <Image 
                src={`/api/placeholder/600/800`}
                alt={categories[0]?.name || "Featured Category"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 p-4 w-full z-10">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{categories[0]?.name || "Featured Category"}</h3>
                <p className="text-gray-200 mb-3 text-sm line-clamp-2">{categories[0]?.description || "Explore our collection of unique items"}</p>
                <Button variant="secondary" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
                  Shop Now
                </Button>
              </div>
            </div>
            
            {/* Smaller categories */}
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="relative h-32 group overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                <Image 
                  src={`/api/placeholder/${500 + index}/${400 + index}`}
                  alt={categories[index]?.name || `Category ${index}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 p-3 w-full z-10">
                  <h3 className="text-sm font-bold text-white">{categories[index]?.name || `Category ${index}`}</h3>
                  <Button variant="link" size="sm" className="text-white p-0 mt-1 text-xs flex items-center">
                    Explore <ChevronRight size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products with Filters */}
        <section className="py-14 sm:py-16 bg-gray-50 -mx-4 sm:-mx-5 lg:-mx-6 px-4 sm:px-5 lg:px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="text-xs h-8">New Arrivals</Button>
                <Button variant="outline" size="sm" className="text-xs h-8">Best Sellers</Button>
                <Button variant="outline" size="sm" className="text-xs h-8">On Sale</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {featuredProducts.slice(0, 8).map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-md transition-all border-0 bg-white rounded-lg">
                  <div className="relative h-40 sm:h-48">
                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                      <Button size="icon" variant="secondary" className="rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart size={14} />
                      </Button>
                      <Button size="icon" variant="secondary" className="rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
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
                      <Badge variant="outline" className="font-normal text-xs">
                        {product.category?.name || "Category"}
                      </Badge>
                      <Badge variant="secondary" className="font-medium text-sm">
                        ${product.price}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm">{product.name}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="py-0 px-3">
                    <CardDescription className="line-clamp-1 text-gray-600 text-xs">
                      {product.description || "No description available"}
                    </CardDescription>
                  </CardContent>
                  
                  <CardFooter className="p-3 pt-2">
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 flex items-center gap-1 h-8 text-xs">
                      <ShoppingCart size={14} /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts / Latest News */}
        <section className="py-14 sm:py-16 bg-white">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">From Our Blog</h2>
            <Button variant="ghost" className="flex items-center gap-1 text-sm">
              Read All Articles <ChevronRight size={14} />
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
                    {posts[0]?.description || "This is a placeholder for your featured blog post description. It contains a brief summary of what readers can expect from the full article."}
                  </p>
                  <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 flex items-center gap-1 text-sm w-fit">
                    Read More <ChevronRight size={14} />
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
                    Read More <ChevronRight size={14} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Trending / Bestsellers */}
      <section className="py-14 sm:py-16 bg-gray-900 text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6">
          <div className="text-center mb-8">
            <Badge className="bg-primary text-white mb-3">Best Sellers</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold">Trending This Week</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {trending.map((product, index) => (
              <div key={product.id} className="group relative overflow-hidden rounded-lg col-span-1">
                <div className="relative h-64">
                  <Image 
                    src={product.images?.[0]?.url || `/api/placeholder/${450 + index}/${550 + index}`}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors"></div>
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-3">
                    <h3 className="text-sm font-bold mb-1">{product.name}</h3>
                    <p className="text-gray-200 mb-2 opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2 text-xs">
                      {product.description || "No description available"}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-xs font-medium">
                        ${product.price}
                      </Badge>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 h-7 text-xs px-2">
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Bonus trending item - featured larger item */}
            <div className="group relative overflow-hidden rounded-lg col-span-2 lg:col-span-2">
              <div className="relative h-64">
                <Image 
                  src={`/api/placeholder/600/400`}
                  alt="Featured trending product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors"></div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <Badge className="bg-red-500 text-white self-start mb-2 text-xs">Hot Deal</Badge>
                  <h3 className="text-base sm:text-lg font-bold mb-1">Limited Edition Collection</h3>
                  <p className="text-gray-200 mb-3 opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2 text-xs sm:text-sm">
                    Exclusive items available for a limited time only. Do not miss out on these special offers.
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-sm font-medium">
                      From $59.99
                    </Badge>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Explore Collection
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14 sm:py-16 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6">
          <div className="max-w-md sm:max-w-xl mx-auto text-center">
            <Badge className="mb-3">Stay Updated</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Join Our Newsletter</h2>
            <p className="text-gray-600 mb-5 text-sm">
              Subscribe to our newsletter for the latest updates, exclusive offers, and insider tips delivered directly to your inbox.
            </p>
            
            {isSubscribed ? (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg">
                <p className="text-base font-medium">Thank you for subscribing!</p>
                <p className="text-sm">We have sent a confirmation email to your inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-9 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 py-2 px-4">
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}