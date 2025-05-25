// app/products/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useDashboardStore } from '@/app/store/dashboardStore';
import { useCollectionStore } from '@/app/store/collectionStore';
import { Suspense, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { products, fetchProducts, categories, fetchCategories, isLoading, currentPage, totalPages } = useDashboardStore();
  const { collections, fetchCollections } = useCollectionStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchCategories();
    fetchCollections();
  }, [fetchCategories, fetchCollections]);

  useEffect(() => {
    const filters = {
      search: searchQuery,
      categoryId: selectedCategory !== 'all' ? parseInt(selectedCategory) : undefined,
      collectionId: selectedCollection !== 'all' ? parseInt(selectedCollection) : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy
    };
    fetchProducts(currentPage, 20, filters);
  }, [searchQuery, selectedCategory, selectedCollection, priceRange, sortBy, currentPage, fetchProducts]);

  // Handle navigation to product detail
  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Filters</h3>
              <Separator className="mb-4" />
            </div>
            
            {/* Category Filter */}
            <div>
              <Label htmlFor="category-filter" className="text-sm font-medium mb-2 block">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-full" id="category-filter">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Collection Filter */}
            <div>
              <Label htmlFor="collection-filter" className="text-sm font-medium mb-2 block">Collection</Label>
              <Select
                value={selectedCollection}
                onValueChange={(value) => setSelectedCollection(value)}
              >
                <SelectTrigger className="w-full" id="collection-filter">
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Collections</SelectItem>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id.toString()}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Price Range Filter */}
            <div className="pt-2">
              <Label className="text-sm font-medium mb-2 block">Price Range</Label>
              <div className="mb-1 flex justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <Slider
                defaultValue={[0, maxPrice]}
                min={0}
                max={maxPrice}
                step={10}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="mt-2"
              />
            </div>

            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCollection('all');
                  setPriceRange([0, maxPrice]);
                  setSortBy('newest');
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
        <div className="md:col-span-3">
          {/* Product Count and Sort */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing {products.length} products
            </p>
            
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gray-500" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                    <div className="h-48 relative">
                      {product.images.length > 0 ? (
                        <Image
                          src={product.images.find(img => img.isMain)?.url || product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4" onClick={() => handleProductClick(product.id)}>
                      <CardTitle className="text-lg mb-2 line-clamp-1">{product.name}</CardTitle>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{product.description}</p>
                      <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {product.category && (
                          <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {product.category.name}
                          </span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleProductClick(product.id)}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm"
                        disabled={!product.inStock}
                      >
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fetchProducts(currentPage - 1, 20)}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Previous page</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fetchProducts(currentPage + 1, 20)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Next page</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}