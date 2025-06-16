'use client';

import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { formatPrice } from '@/lib/utils';
import { Category, Collection, Product, ProductImage, ProductType } from '@prisma/client';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type ProductWithRequiredCategory = Product & {
  images: ProductImage[];
  category: { name: string };
};

interface InitialData {
  products: (Product & {
    images: ProductImage[];
    category: { name: string } | null;
  })[];
  categories: Category[];
  collections: Collection[];
}

interface DiscountProductsContentProps {
  initialData: InitialData;
}


export default function DiscountProductsContent({ initialData }: DiscountProductsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductWithRequiredCategory[]>(
    initialData.products.filter((p): p is ProductWithRequiredCategory => p.category !== null)
  );
  const [collections, ] = useState<Collection[]>(initialData.collections);
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sortBy, setSortBy] = useState("discount");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false);

  // Combined effect for URL updates and product fetching
  useEffect(() => {
    // Skip if already fetching
    if (isFetchingRef.current) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(async () => {
      // Prevent concurrent fetches
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        // Update URL
        const params = new URLSearchParams(searchParams.toString());
        if (selectedType) {
          params.set("type", selectedType);
        } else {
          params.delete("type");
        }
        if (selectedCollections.length > 0) {
          params.set("collections", selectedCollections.join(","));
        } else {
          params.delete("collections");
        }
        if (priceRange[0] > 0) {
          params.set("minPrice", priceRange[0].toString());
        } else {
          params.delete("minPrice");
        }
        if (priceRange[1] < 10000000) {
          params.set("maxPrice", priceRange[1].toString());
        } else {
          params.delete("maxPrice");
        }
        if (sortBy !== "discount") {
          params.set("sort", sortBy);
        } else {
          params.delete("sort");
        }
        params.set("page", currentPage.toString());

        // Update URL without scroll
        router.replace(`/products/discount?${params.toString()}`, { scroll: false });

        // Fetch products
        setIsLoading(true);
        const response = await axios.get(`/api/products/discount?${params.toString()}`);
        const data = response.data;
        if (data && Array.isArray(data.products)) {
          setProducts(data.products.filter((p: Product & { category: { name: string } | null }): p is ProductWithRequiredCategory => p.category !== null));
        } else {
          setProducts([]);
          console.error("API response missing products array:", data);
        }
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [selectedType, selectedCollections, priceRange, sortBy, currentPage, router, searchParams]);

  // Initialize filters from URL
  useEffect(() => {
    const type = searchParams.get("type") as ProductType | null;
    if (type && ["PHONG_THUY", "THOI_TRANG"].includes(type)) {
      setSelectedType(type);
    } else {
      setSelectedType(null);
    }
    const collections = searchParams.get("collections")?.split(",") || [];
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");
    const page = searchParams.get("page");

    setSelectedCollections(collections);
    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 10000000
      ]);
    }
    if (sort) {
      setSortBy(sort);
    }
    if (page) {
      setCurrentPage(parseInt(page));
    }
  }, [searchParams]);

  const handleTypeChange = (type: ProductType | null) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleCollectionChange = (collectionId: string) => {
    setSelectedCollections(prev =>
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Only scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="md:col-span-1 space-y-6">
          {/* Sort By */}
          <div>
            <h2 className="text-base font-bold mb-2">SẮP XẾP THEO</h2>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount">Giảm giá cao nhất</SelectItem>
                <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
              </SelectContent>
            </Select>
            <Separator className="my-4" />
          </div>

          {/* Product Type */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Product Type</h3>
            <div className="space-y-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="PHONG_THUY"
                    checked={selectedType === "PHONG_THUY"}
                    onChange={() => handleTypeChange(selectedType === "PHONG_THUY" ? null : "PHONG_THUY")}
                  />
                  <span>Phong thủy</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="THOI_TRANG"
                    checked={selectedType === "THOI_TRANG"}
                    onChange={() => handleTypeChange(selectedType === "THOI_TRANG" ? null : "THOI_TRANG")}
                  />
                  <span>Thời trang</span>
                </label>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h2 className="text-base font-bold mb-2">BỘ SƯU TẬP</h2>
            <div className="space-y-2 ml-2">
              {collections.map((collection) => (
                <label key={collection.id} className="flex items-center gap-2">
                  <input type="radio" name="collection" value={collection.id.toString()} checked={selectedCollections.includes(collection.id.toString())} onChange={() => handleCollectionChange(collection.id.toString())} />
                  <span>{collection.name}</span>
                </label>
              ))}
            </div>
            <Separator className="my-4" />
          </div>

          {/* Price Filter */}
          <div>
            <h2 className="text-base font-bold mb-2">Khoảng giá</h2>
            <div className="mb-1 flex justify-between text-sm">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
            <Slider
              defaultValue={[0, 10000000]}
              min={0}
              max={10000000}
              step={100000}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="mt-2"
            />
            <Separator className="my-4" />
          </div>

          {/* Clear Filter Button */}
          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSelectedType(null);
                setSelectedCollections([]);
                setPriceRange([0, 10000000]);
                setSortBy('discount');
                setCurrentPage(1);
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </aside>

        {/* Products Grid */}
        <section className="md:col-span-3">
          {/* Product Count */}
          <div className="flex items-center mb-6">
            <p className="text-sm text-gray-500">
              Showing {products.length} of {totalPages * 12} products
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, i) => (
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
                  <ProductCard
                    key={product.id}
                    product={product}
                    showDiscount={true}
                  />
                ))}
              </div>
              
              {/* Pagination Controls */}
              <nav className="flex justify-center items-center gap-4 mt-8" aria-label="Product pagination">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={pageNumber}
                          variant={pageNumber === currentPage ? "default" : "outline"}
                          onClick={() => handlePageChange(pageNumber)}
                          className="w-10 h-10"
                          aria-label={`Page ${pageNumber}`}
                          aria-current={pageNumber === currentPage ? 'page' : undefined}
                        >
                          {pageNumber}
                        </Button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber} aria-hidden="true">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </>
          )}
        </section>
      </div>
    </main>
  );
} 