// app/checkout/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeftIcon, 
  CreditCardIcon, 
  ShieldCheckIcon, 
  CheckCircleIcon, 
  AlertCircleIcon
} from 'lucide-react';
import { useDashboardStore } from '@/app/store/dashboardStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import axios from 'axios';

export default function PaymentPage() {
  const router = useRouter();
  const { cart, clearCart } = useDashboardStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cod'>('qr');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Vietnam",
    postalCode: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  console.log(cart)
  const shippingCost = subtotal > 100 ? 0 : 10;
  const total = subtotal + shippingCost;

  // Go back to previous page
  const goBack = () => {
    router.back();
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
        !formData.address || !formData.city || !formData.country) {
      setFormError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create order object
      const orderData = {
        total,
        paymentMethod: paymentMethod === 'qr' ? 'CARD' : 'COD',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        postalCode: formData.postalCode || undefined,
        orderItems: cart.map(item => ({
          productId: Number(item.productId),
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.imageUrl,
          stoneSize: item.selectedStoneSize ? item.selectedStoneSize.size : undefined,
          wristSize: item.wristSize,
        }))
      };

      // Submit order directly using axios instead of the store
      const response = await axios.post('/api/orders', orderData);
      
      if (response.status === 201) {
        // Clear cart after successful order creation
        clearCart();
        
        // Redirect to success page
        router.push('/checkout/success');
      } else {
        setFormError("Order processing failed. Please try again.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setFormError(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={goBack} 
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeftIcon size={16} className="mr-1" />
            Quay lại giỏ hàng
          </button>
          <h1 className="text-2xl font-bold">Thanh toán</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin giao hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Họ <span className="text-red-500">*</span></Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Tên <span className="text-red-500">*</span></Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại <span className="text-red-500">*</span></Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ <span className="text-red-500">*</span></Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={formData.address}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="city">Thành phố <span className="text-red-500">*</span></Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={formData.city}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Quốc gia</Label>
                      <Select 
                        value={formData.country} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Chọn quốc gia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vietnam">Việt Nam</SelectItem>
                          <SelectItem value="USA">Hoa Kỳ</SelectItem>
                          <SelectItem value="Japan">Nhật Bản</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Mã bưu điện</Label>
                      <Input 
                        id="postalCode" 
                        name="postalCode" 
                        value={formData.postalCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Payment Method */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Phương thức thanh toán</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(value: 'qr' | 'cod') => setPaymentMethod(value)} 
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="qr" id="payment-qr" />
                      <Label htmlFor="payment-qr" className="flex-1 cursor-pointer">
                        <div className="flex items-center">
                          <CreditCardIcon className="mr-2" size={18} />
                          <span>Thanh toán qua QR code (TPBank VietQR)</span>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="cod" id="payment-cod" />
                      <Label htmlFor="payment-cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center">
                          <ShieldCheckIcon className="mr-2" size={18} />
                          <span>Thanh toán khi nhận hàng (COD)</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === "qr" && (
                    <div className="mt-6 space-y-4 border-t pt-4 flex flex-col items-center">
                      <Image 
                        src="/qr-code.png" 
                        alt="chuyen-khoan-ngan-hang" 
                        width={300} 
                        height={300} 
                        className="rounded-lg border"
                      />
                      <div className="mt-4 w-full max-w-xs mx-auto bg-gray-50 rounded-lg p-4 border text-sm">
                        <div className="mb-2 flex justify-between">
                          <span className="font-medium">Tên tài khoản:</span>
                          <span>NGUYỄN THỊ PHƯƠNG THẢO</span>
                        </div>
                        <div className="mb-2 flex justify-between">
                          <span className="font-medium">Ngân hàng:</span>
                          <span>Vietcombank</span>
                        </div>
                        <div className="mb-2 flex justify-between">
                          <span className="font-medium">Số tài khoản:</span>
                          <span>123456789</span>
                        </div>
                        <div className="mb-2 flex justify-between">
                          <span className="font-medium">Số tiền:</span>
                          <span>{total.toFixed(2)} VND</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Nội dung:</span>
                          <span>Thanh toan don hang tiem gem</span>
                        </div>
                      </div>
                      <div className="text-center text-sm text-gray-700">
                        Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử để thanh toán {total.toFixed(2)} VND<br/>
                        Vui lòng ghi rõ nội dung chuyển khoản nếu được yêu cầu.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Form Error */}
              {formError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircleIcon className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-red-700 text-sm">{formError}</p>
                </div>
              )}
              
              {/* Mobile Order Summary (shown on small screens) */}
              <div className="lg:hidden mb-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="summary">
                    <AccordionTrigger className="font-medium">
                      Xem thông tin đơn hàng
                    </AccordionTrigger>
                    <AccordionContent>
                      <OrderSummary 
                        cart={cart} 
                        subtotal={subtotal} 
                        shippingCost={shippingCost} 
                        total={total} 
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : `Thanh toán ${total.toFixed(2)}$`}
              </Button>
              
              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <ShieldCheckIcon size={16} className="mr-1" />
                <span>Thanh toán an toàn & bảo mật</span>
              </div>
            </form>
          </div>
          
          {/* Order Summary (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <OrderSummary 
                    cart={cart} 
                    subtotal={subtotal} 
                    shippingCost={shippingCost} 
                    total={total} 
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Order Summary Component (extracted to reduce repetition)
type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  selectedStoneSize?: { size: string };
  wristSize?: number;
};

type OrderSummaryProps = {
  cart: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
};

function OrderSummary({ cart, subtotal, shippingCost, total }: OrderSummaryProps) {
  return (
    <div>
      <div className="space-y-4 mb-5">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border-b py-4">
            <div className="relative h-16 w-16 rounded-md overflow-hidden border flex-shrink-0 bg-white">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover p-1"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full text-gray-400 text-xs">
                  No image
                </div>  
              )}
              <div className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              {(item.selectedStoneSize || item.wristSize) && (
                <div className="text-sm text-gray-500 space-y-1">
                  {item.selectedStoneSize && (
                    <div>Size đá: {item.selectedStoneSize.size}</div>
                  )}
                  {item.wristSize && (
                    <div>Cổ tay: {item.wristSize}cm</div>
                  )}
                </div>
              )}
            </div>
            <div className="text-sm font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tạm tính</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Phí vận chuyển</span>
          <span>{shippingCost === 0 ? 'Miễn phí' : `$${shippingCost.toFixed(2)}`}</span>
        </div>
        {shippingCost > 0 && (
          <div className="text-xs text-gray-500 italic">
            Miễn phí vận chuyển cho đơn hàng trên $100
          </div>
        )}
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between font-medium">
        <span>Tổng cộng</span>
        <span className="text-lg">${total.toFixed(2)}</span>
      </div>
      
      <div className="mt-6 bg-green-50 border border-green-100 rounded-lg p-3 flex items-start text-sm">
        <CheckCircleIcon className="text-green-600 mr-2 flex-shrink-0 mt-0.5" size={16} />
        <p className="text-green-800">
          Đơn hàng của bạn đủ điều kiện giao hàng tiêu chuẩn (3-5 ngày làm việc)
        </p>
      </div>
    </div>
  );
}