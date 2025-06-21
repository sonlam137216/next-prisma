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
import Link from 'next/link';
import { StoneSize } from '@/app/types/product';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [selectedStoneSize, setSelectedStoneSize] = useState<StoneSize | null>(null);
  const [wristSize, setWristSize] = useState(12); // Default 12cm
  
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
          await fetchProducts(1, 20);
          await fetchCategories();
        }
        
        if (foundProduct && foundProduct.stoneSizes && foundProduct.stoneSizes.length > 0) {
          setSelectedStoneSize(foundProduct.stoneSizes[0]);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params, fetchProduct, fetchProducts, fetchCategories]);
  
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
  
  const handleWristSizeChange = (amount: number) => {
    const newWristSize = wristSize + amount;
    if (newWristSize >= 8 && newWristSize <= 25) { // Giới hạn từ 8cm đến 25cm
      setWristSize(newWristSize);
    }
  };
  
  const handleGoBack = () => {
    router.push('/products');
  };
  
  // Add to cart handler
  const handleAddToCart = () => {
    if (!product || !product.inStock) return;
    if (product.stoneSizes && product.stoneSizes.length > 0 && !selectedStoneSize) {
      toast('Vui lòng chọn size viên đá!', { duration: 2000 });
      return;
    }
    setIsAddingToCart(true);
    // Truyền thông tin size viên đá và wristSize vào product
    const productToAdd = {
      ...product,
      price: selectedStoneSize ? selectedStoneSize.price : product.price,
      selectedStoneSize: selectedStoneSize ? { size: selectedStoneSize.size } : undefined,
      wristSize: wristSize,
    };
    addToCart(productToAdd, quantity);
    toast('Thêm vào giỏ hàng thành công', {
      description: `Đã thêm ${quantity} ${product.name}${selectedStoneSize ? ` (Size: ${selectedStoneSize.size})` : ''}${wristSize ? ` (Cổ tay: ${wristSize}cm)` : ''} vào giỏ hàng.`,
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
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="list-reset flex">
          <li>
            <Link href="/" className="hover:underline text-gray-700">Trang chủ</Link>
          </li>
          <li><span className="mx-2">/</span></li>
          <li>
            <Link href="/products" className="hover:underline text-gray-700">Sản phẩm</Link>
          </li>
          {product.type && (
            <>
              <li><span className="mx-2">/</span></li>
              <li>
                <Link
                  href={`/products?type=${product.type}`}
                  className="hover:underline text-gray-700"
                >
                  {product.type === 'PHONG_THUY' ? 'Phong thủy' : product.type === 'THOI_TRANG' ? 'Thời trang' : product.type}
                </Link>
              </li>
            </>
          )}
          <li><span className="mx-2">/</span></li>
          <li className="text-primary font-semibold">{product.name}</li>
        </ol>
      </nav>
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
              {product.hasDiscount && product.discountStartDate && product.discountEndDate && 
               new Date() >= new Date(product.discountStartDate) && 
               new Date() <= new Date(product.discountEndDate) && (
                <Badge variant="destructive">
                  -{product.discountPercentage}%
                </Badge>
              )}
            </div>
            {/* Size viên đá */}
            {product.stoneSizes && product.stoneSizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Size Viên Đá</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.stoneSizes.map((s) => (
                    <Button
                      key={s.id}
                      type="button"
                      variant={selectedStoneSize?.id === s.id ? 'default' : 'outline'}
                      className={selectedStoneSize?.id === s.id ? 'border-primary' : ''}
                      onClick={() => setSelectedStoneSize(s)}
                    >
                      {s.size} ({s.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })})
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Size cổ tay */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Size Cổ Tay (cm)</h3>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleWristSizeChange(-0.5)}
                  disabled={wristSize <= 8}
                >
                  <MinusIcon size={16} />
                </Button>
                <span className="mx-4 w-16 text-center font-medium">{wristSize} cm</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleWristSizeChange(0.5)}
                  disabled={wristSize >= 25}
                >
                  <PlusIcon size={16} />
                </Button>
                <span className="ml-4 text-sm text-gray-500">
                  Tăng/giảm 0.5cm
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Kích thước từ 8cm đến 25cm
              </p>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              {product.hasDiscount && product.discountStartDate && product.discountEndDate && 
               new Date() >= new Date(product.discountStartDate) && 
               new Date() <= new Date(product.discountEndDate) ? (
                <>
                  <p className="text-3xl font-bold text-red-500">
                    {(selectedStoneSize ? selectedStoneSize.price : product.discountPrice)?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </p>
                  <p className="text-xl text-gray-500 line-through">
                    {(selectedStoneSize ? selectedStoneSize.price : product.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </p>
                </>
              ) : (
                <p className="text-3xl font-bold">
                  {(selectedStoneSize ? selectedStoneSize.price : product.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </p>
              )}
            </div>
            
            {/* Short description */}
            {product.description && (
              <div className="bg-gray-50 rounded-md mb-6 text-sm text-gray-800">
                <p>{product.description}</p>
              </div>
            )}
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
      
      {/* Additional Information Sections - Thay thế phần này bằng Tabs */}
      <Tabs defaultValue="shipping-info" className="w-full mt-12">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger className="py-2 mb-2" value="shipping-info">Thông tin giao hàng</TabsTrigger>
          <TabsTrigger className="py-2 mb-2" value="product-details">Chi tiết sản phẩm</TabsTrigger>
        </TabsList>
        <TabsContent value="shipping-info">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin vận chuyển và hoàn trả</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid md:grid-cols-1 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Giao Hàng</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Nội thành: Giao từ 1 – 3 ngày, Miễn phí giao hàng trong bán kính 10km</li>
                    <li>Tỉnh khác: Giao từ 5 – 7 ngày, 30.000 VNĐ / đơn</li>
                    <li>Lưu ý: Thời gian nhận hàng có thể thay đổi sớm hoặc muộn hơn tùy theo địa chỉ cụ thể của khách hàng.</li>
                    <li>Trong trường hợp sản phẩm tạm hết hàng, nhân viên CSKH sẽ liên hệ trực tiếp với quý khách để thông báo về thời gian giao hàng.</li>
                    <li>Nếu khách hàng có yêu cầu về Giấy Kiểm Định Đá, đơn hàng sẽ cộng thêm 20 ngày để hoàn thành thủ tục.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Chính sách hoàn trả</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Chúng tôi chấp nhận đổi / trả sản phẩm ngay lúc khách kiểm tra và xác nhận hàng hóa. Chúng tôi cam kết sẽ hỗ trợ và áp dụng chính sách bảo hành tốt nhất tới Quý khách, đảm bảo mọi quyền lợi Quý khách được đầy đủ.</li>
                    <li>Những trình trạng bể, vỡ do quá trình quý khách sử dụng chúng tôi xin từ chối đổi hàng.</li>
                    <li>Tùy vào tình hình thực tế của sản phẩm, chúng tôi sẽ cân nhắc hỗ trợ đổi / trả nếu sản phẩm lỗi hoặc các vấn đề liên quan khác.</li>
                    <li>Chúng tôi nhận bảo hành dây đeo vĩnh viễn dành cho khách hàng nếu tình trạng dây lâu ngày bị giãn nở, cọ xát với đá gây đứt dây trong quá trình sử dụng, chi phí vận chuyển xin quý khách vui lòng tự thanh toán.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="product-details">
          <Card>
            <CardContent className="space-y-2 text-sm text-gray-700 whitespace-pre-wrap">
              {product.detailedDescription || product.description || 'Không có mô tả chi tiết cho sản phẩm này.'}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
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
                      <p className="font-semibold text-sm">
                        {relatedProduct.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </p>
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