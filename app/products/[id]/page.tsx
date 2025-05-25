'use client';

import { Product, useDashboardStore } from '@/app/store/dashboardStore';
import MainLayout from '@/components/MainLayout';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const { 
    products,
    fetchProducts, 
    fetchCategories, 
    addToCart, 
    toggleCart,
    fetchProduct 
  } = useDashboardStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch product data
  useEffect(() => {
    const loadData = async () => {
      try {
        const resolvedParams = await params;
        const productId = parseInt(resolvedParams.id);
        
        // Fetch the specific product first
        const foundProduct = await fetchProduct(productId);
        setProduct(foundProduct);
        
        // Only fetch all products if we need them for related products
        if (foundProduct && foundProduct.category) {
          await fetchProducts();
          await fetchCategories();
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params, fetchProduct]);
  
  // Update related products when products array changes
  useEffect(() => {
    if (product && product.category && products.length > 0) {
      const related = products
        .filter(p => p.category?.id === product.category?.id && p.id !== product.id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
  }, [products, product]);
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!product) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-16">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Product Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The product you are looking for does not exist.</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };
  
  const handleGoBack = () => {
    router.push('/products');
  };
  
  // Add to cart handler
  const handleAddToCart = () => {
    if (!product || !product.inStock) return;
  
  setIsAddingToCart(true);
  
  // Pass the actual product object to addToCart
  addToCart(product, quantity);
  
  // Show toast notification
  toast('Thêm vào giỏ hàng thành công', {
    description: `Đã thêm ${quantity} ${product.name} vào giỏ hàng.`,
    duration: 3000
  });
  
  setIsAddingToCart(false);
  };
  
  // Buy now handler - Add to cart and open cart sidebar
  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => toggleCart(), 300); // Open cart after a short delay
  };
  
  return (
    <MainLayout>
      {/* Back button */}
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2"
        onClick={handleGoBack}
      >
        <ArrowLeftIcon size={16} />
        Quay lại Sản phẩm
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="md:max-w-md">
          <div className="aspect-square relative rounded-lg overflow-hidden mb-3 border shadow-sm">
            {product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage].url}
                alt={product.name}
                fill
                className="object-contain p-2"
              />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                <span className="text-gray-400">Không có hình ảnh</span>
              </div>
            )}
          </div>
          
          {/* Thumbnail gallery */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-6 gap-1">
              {product.images.map((image, index) => (
                <div 
                  key={image.id} 
                  className={`aspect-square relative rounded-md overflow-hidden cursor-pointer border ${selectedImage === index ? 'border-blue-400 shadow-sm' : 'border-gray-100'}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover p-1"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              {product.category && (
                <Badge variant="secondary">
                  {product.category.name}
                </Badge>
              )}
              <Badge variant={product.inStock ? "default" : "destructive"}>
                {product.inStock ? 'Còn hàng' : 'Hết hàng'}
              </Badge>
            </div>
            <p className="text-3xl font-bold mb-4">${product.price.toFixed(2)}</p>
            
            {/* Chi tiết sản phẩm */}
            <div className="bg-gray-50 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-2">Chi tiết sản phẩm</h2>
              <p className="text-gray-700">{product.description || 'Không có mô tả chi tiết cho sản phẩm này.'}</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Quantity selector */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Số lượng</h3>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <MinusIcon size={16} />
              </Button>
              <span className="mx-4 w-8 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.quantity}
              >
                <PlusIcon size={16} />
              </Button>
              <span className="ml-4 text-sm text-gray-500">
                {product.quantity} sản phẩm có sẵn
              </span>
            </div>
          </div>
          
          {/* Add to cart and Buy now buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              className="flex-1 flex items-center justify-center gap-2" 
              size="lg"
              disabled={!product.inStock || isAddingToCart}
              onClick={handleAddToCart}
            >
              <ShoppingBagIcon size={16} />
              Thêm vào giỏ hàng
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1" 
              size="lg"
              disabled={!product.inStock || isAddingToCart}
              onClick={handleBuyNow}
            >
              Mua ngay
            </Button>
          </div>
        </div>
      </div>
      
      {/* Additional Information Sections */}
      <div className="space-y-8 mt-12">
        {/* Specifications Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Thông số kỹ thuật</h2>
            <div>
              <table className="min-w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Mã sản phẩm</td>
                    <td className="py-2">{product.id}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Danh mục</td>
                    <td className="py-2">{product.category?.name || 'Chưa phân loại'}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Tình trạng</td>
                    <td className="py-2">{product.inStock ? 'Còn hàng' : 'Hết hàng'}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Ngày thêm</td>
                    <td className="py-2">{new Date(product.createdAt).toLocaleDateString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Sản phẩm liên quan</h2>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {relatedProducts.map((relatedProduct) => (
                <CarouselItem key={relatedProduct.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                  <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                    <div className="h-40 relative">
                      {relatedProduct.images.length > 0 ? (
                        <Image
                          src={relatedProduct.images[0].url}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover p-1"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <span className="text-gray-400">Không có ảnh</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3" onClick={() => router.push(`/products/${relatedProduct.id}`)}>
                      <h3 className="font-medium mb-1 line-clamp-1 text-sm">{relatedProduct.name}</h3>
                      <p className="font-semibold text-sm">${relatedProduct.price.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 w-8 h-8" />
            <CarouselNext className="hidden md:flex -right-4 w-8 h-8" />
          </Carousel>
        </div>
      )}
    </MainLayout>
  );
}