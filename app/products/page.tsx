// app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FilterIcon, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDashboardStore, Product } from '../store/dashboardStore';
import { useCollectionsStore } from '../store/collections-store';
import MainLayout from '@/components/MainLayout';

const ITEMS_PER_PAGE = 15;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { products, fetchProducts, categories, fetchCategories, isLoading, currentPage, totalPages } = useDashboardStore();
  const { collections, fetchCollections } = useCollectionsStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
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

  // Filter panel component
  const FilterPanel = () => (
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
  );
  
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-8 mt-16">Products</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop (Left Sidebar) */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-4 bg-white rounded-lg border p-6">
            <FilterPanel />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <FilterIcon size={16} />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="py-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
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
          
          {/* Products Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p>Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fetchProducts(currentPage - 1, 20)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
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
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters to find what you are looking for.</p>
              <Button 
                variant="outline" 
                className="mt-4"
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
          )}
        </div>
      </div>
    </MainLayout>
  );
}