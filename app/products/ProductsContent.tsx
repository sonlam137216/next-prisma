'use client';

import { Collection, useCollectionStore } from '@/app/store/collectionStore';
import { Category, ExtendedProduct, useDashboardStore } from '@/app/store/dashboardStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InitialData {
  products: ExtendedProduct[];
  categories: Category[];
  collections: Collection[];
}

interface ProductsContentProps {
  initialData: InitialData;
}

export default function ProductsContent({ initialData }: ProductsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const collectionIdFromUrl = searchParams.get('collectionId');
  const { 
    products, 
    fetchProducts, 
    categories, 
    fetchCategories, 
    isLoading, 
    totalPages,
    addToCart,
    toggleCart,
    setInitialData
  } = useDashboardStore();
  const { collections, fetchCollections, setInitialCollections } = useCollectionStore();
  const [selectedCollection, setSelectedCollection] = useState(collectionIdFromUrl || '');
  const maxPrice = 1000000
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLine, setSelectedLine] = useState<string>('');
  const [selectedMenh, setSelectedMenh] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Initialize with SSR data
  useEffect(() => {
    setInitialData(initialData.products);
    setInitialCollections(initialData.collections);
  }, [initialData, setInitialData, setInitialCollections]);

  // Update selectedCollection when URL changes
  useEffect(() => {
    if (collectionIdFromUrl) {
      setSelectedCollection(collectionIdFromUrl);
    } else {
      setSelectedCollection('all');
    }
  }, [collectionIdFromUrl]);

  // Fetch additional data if needed
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
    if (collections.length === 0) {
      fetchCollections();
    }
  }, [categories.length, collections.length, fetchCategories, fetchCollections]);

  // Debounce for priceRange
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // For priceRange, debounce the API call
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const filters = {
        search: searchQuery,
        type: selectedType || undefined,
        line: selectedLine || undefined,
        menh: selectedMenh || undefined,
        collectionId: selectedCollection ? parseInt(selectedCollection) : undefined,
        categorySlug: selectedCategory !== 'all' ? selectedCategory : undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy,
        page,
        limit: itemsPerPage
      };
      fetchProducts(page, itemsPerPage, filters);
    }, 700);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [priceRange, searchQuery, selectedType, selectedLine, selectedMenh, selectedCollection, selectedCategory, sortBy, page, fetchProducts]);

  // Reset filters when collection changes
  useEffect(() => {
    if (collectionIdFromUrl) {
      setPriceRange([0, maxPrice]);
      setSortBy('newest');
      setPage(1);
      setSelectedMenh('');
    }
  }, [collectionIdFromUrl, maxPrice]);

  // Set selectedType from URL on mount
  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl && (typeFromUrl === 'PHONG_THUY' || typeFromUrl === 'THOI_TRANG')) {
      setSelectedType(typeFromUrl);
    }
  }, [searchParams]);

  // Lấy slug từ URL (?category=slug) khi vào trang
  useEffect(() => {
    const categorySlugFromUrl = searchParams.get('category');
    if (categorySlugFromUrl) {
      setSelectedCategory(categorySlugFromUrl);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  // Handle navigation to product detail
  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  // Add to cart handler
  const handleAddToCart = (product: ExtendedProduct) => {
    if (!product || !product.inStock) return;
    
    setIsAddingToCart(product.id);
    
    // Add to cart with quantity 1
    addToCart(product, 1);
    
    // Show toast notification
    toast('Thêm vào giỏ hàng thành công', {
      description: `Đã thêm ${product.name} vào giỏ hàng.`,
      duration: 3000
    });
    
    setIsAddingToCart(null);
  };

  // Buy now handler
  const handleBuyNow = (product: ExtendedProduct) => {
    handleAddToCart(product);
    setTimeout(() => toggleCart(), 300); // Open cart after a short delay
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold mb-2">LOẠI SẢN PHẨM</h2>
              <div className="space-y-2 ml-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="type" value="PHONG_THUY" checked={selectedType === 'PHONG_THUY'} onChange={() => setSelectedType('PHONG_THUY')} />
                  <span>Phong thủy</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="type" value="THOI_TRANG" checked={selectedType === 'THOI_TRANG'} onChange={() => setSelectedType('THOI_TRANG')} />
                  <span>Thời trang</span>
                </label>
              </div>
              <Separator className="my-4" />
            </div>
            {/* DÒNG SẢN PHẨM */}
            <div>
              <h2 className="text-base font-bold mb-2">DÒNG SẢN PHẨM</h2>
              <div className="space-y-2 ml-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="line" value="CAO_CAP" checked={selectedLine === 'CAO_CAP'} onChange={() => setSelectedLine('CAO_CAP')} />
                  <span>Cao cấp</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="line" value="TRUNG_CAP" checked={selectedLine === 'TRUNG_CAP'} onChange={() => setSelectedLine('TRUNG_CAP')} />
                  <span>Trung cấp</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="line" value="PHO_THONG" checked={selectedLine === 'PHO_THONG'} onChange={() => setSelectedLine('PHO_THONG')} />
                  <span>Phổ thông</span>
                </label>
              </div>
              <Separator className="my-4" />
            </div>
            {/* BỘ SƯU TẬP */}
            <div>
              <h2 className="text-base font-bold mb-2">BỘ SƯU TẬP</h2>
              <div className="space-y-2 ml-2">
                {collections.map((collection) => (
                  <label key={collection.id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="collection" 
                      value={collection.id} 
                      checked={selectedCollection === collection.id.toString()} 
                      onChange={() => setSelectedCollection(collection.id.toString())} 
                    />
                    <span>{collection.name}</span>
                  </label>
                ))}
              </div>
              <Separator className="my-4" />
            </div>
            {/* MỆNH */}
            <div>
              <h2 className="text-base font-bold mb-2">MỆNH</h2>
              <div className="space-y-2 ml-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="menh" 
                    value="KIM" 
                    checked={selectedMenh === 'KIM'} 
                    onChange={() => setSelectedMenh('KIM')} 
                  />
                  <span>Kim</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="menh" 
                    value="MOC" 
                    checked={selectedMenh === 'MOC'} 
                    onChange={() => setSelectedMenh('MOC')} 
                  />
                  <span>Mộc</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="menh" 
                    value="THUY" 
                    checked={selectedMenh === 'THUY'} 
                    onChange={() => setSelectedMenh('THUY')} 
                  />
                  <span>Thủy</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="menh" 
                    value="HOA" 
                    checked={selectedMenh === 'HOA'} 
                    onChange={() => setSelectedMenh('HOA')} 
                  />
                  <span>Hỏa</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="menh" 
                    value="THO" 
                    checked={selectedMenh === 'THO'} 
                    onChange={() => setSelectedMenh('THO')} 
                  />
                  <span>Thổ</span>
                </label>
              </div>
              <Separator className="my-4" />
            </div>
            {/* DANH MỤC SẢN PHẨM */}
            <div>
              <h2 className="text-base font-bold mb-2">DANH MỤC</h2>
              <div className="ml-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator className="my-4" />
            </div>
            {/* Price Filter */}
            <div>
              <h2 className="text-base font-bold mb-2">Khoảng giá</h2>
              <div className="mb-1 flex justify-between text-sm">
                <span>{priceRange[0].toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                <span>{priceRange[1].toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
              </div>
              <Slider
                defaultValue={[0, maxPrice]}
                min={0}
                max={maxPrice}
                step={100000}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
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
                  setSelectedType('');
                  setSelectedLine('');
                  setSelectedCollection('');
                  setSelectedMenh('');
                  setSelectedCategory('all');
                  setPriceRange([0, maxPrice]);
                  setSortBy('newest');
                  setPage(1);
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </aside>
        <section className="md:col-span-3">
          {/* Product Count */}
          <div className="flex items-center mb-6">
            <p className="text-sm text-gray-500">
              Showing {products.length} of {totalPages * itemsPerPage} products
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(itemsPerPage)].map((_, i) => (
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
                  <article key={product.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                    <Card>
                      <div className="h-48 relative">
                        {product.images.length > 0 ? (
                          <Image
                            src={product.images.find(img => img.isMain)?.url || product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority={page === 1}
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
                        <p className="font-semibold text-lg">
                          {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </p>
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
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={!product.inStock || isAddingToCart === product.id}
                            onClick={() => handleBuyNow(product)}
                          >
                            Buy Now
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </article>
                ))}
              </div>
              
              {/* Pagination Controls */}
              <nav className="flex justify-center items-center gap-4 mt-8" aria-label="Product pagination">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= page - 1 && pageNumber <= page + 1)
                    ) {
                      return (
                        <Button
                          key={pageNumber}
                          variant={pageNumber === page ? "default" : "outline"}
                          onClick={() => handlePageChange(pageNumber)}
                          className="w-10 h-10"
                          aria-label={`Page ${pageNumber}`}
                          aria-current={pageNumber === page ? 'page' : undefined}
                        >
                          {pageNumber}
                        </Button>
                      );
                    } else if (
                      pageNumber === page - 2 ||
                      pageNumber === page + 2
                    ) {
                      return <span key={pageNumber} aria-hidden="true">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  Next
                </Button>
              </nav>
            </>
          )}
        </section>
      </div>
    </main>
  );
} 