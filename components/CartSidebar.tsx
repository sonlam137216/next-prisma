'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MinusIcon, 
  PlusIcon, 
  TrashIcon, 
  ShoppingCartIcon,
  ShoppingBagIcon,
  XIcon,
  ArrowRightIcon
} from 'lucide-react';
import { useDashboardStore, CartItem } from '@/app/store/dashboardStore';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const { cart, isCartOpen, toggleCart, updateCartItemQuantity, removeFromCart, clearCart } = useDashboardStore();
  const router = useRouter();
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate shipping - free over $100
  const shippingCost = subtotal > 100 ? 0 : 10;
  const total = subtotal + shippingCost;
  
  // Handle quantity changes
  const handleQuantityChange = (item: CartItem, change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1 && newQuantity <= item.maxQuantity) {
      updateCartItemQuantity(item.productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    toggleCart(); // Close the cart first
    router.push('/checkout'); // Redirect to checkout page
  };
  
  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 shadow-xl border-l">
        <SheetHeader className="px-6 py-5 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center text-lg font-semibold">
              <ShoppingBagIcon className="mr-2" size={18} />
              Giỏ hàng của bạn 
              <span className="ml-2 text-sm font-medium bg-primary text-white rounded-full px-2 py-0.5">
                {totalItems}
              </span>
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={toggleCart} className="h-8 w-8">
              <XIcon size={16} />
            </Button>
          </div>
        </SheetHeader>
        
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-16 text-center px-6">
            <div className="bg-gray-50 rounded-full p-6 mb-4">
              <ShoppingCartIcon size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Giỏ hàng trống</h3>
            <p className="text-gray-500 mb-6 max-w-xs">Bạn chưa thêm sản phẩm nào vào giỏ hàng</p>
            <Button onClick={toggleCart} className="rounded-full px-8">
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto pt-2">
              {cart.map((item, index) => (
                <motion.div 
                  key={item.id} 
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden border bg-white">
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
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-sm mb-1 line-clamp-1">{item.name}</h3>
                        <Button 
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full opacity-70 hover:opacity-100 -mr-1"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <TrashIcon size={14} className="text-gray-500" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">${item.price.toFixed(2)}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-full h-8 overflow-hidden">
                          <Button 
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleQuantityChange(item, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon size={14} />
                          </Button>
                          <span className="px-2 text-sm font-medium">{item.quantity}</span>
                          <Button 
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleQuantityChange(item, 1)}
                            disabled={item.quantity >= item.maxQuantity}
                          >
                            <PlusIcon size={14} />
                          </Button>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  {index < cart.length - 1 && <Separator className="mt-4" />}
                </motion.div>
              ))}
            </div>
            
            <div className="border-t mt-auto">
              <div className="px-6 py-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Tạm tính</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Phí vận chuyển</span>
                  <span>{shippingCost === 0 ? 'Miễn phí' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                {shippingCost > 0 && (
                  <div className="text-xs text-gray-500 italic">
                    Miễn phí vận chuyển cho đơn hàng trên $100
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center font-medium text-lg">
                  <span>Tổng cộng</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <SheetFooter className="px-6 py-4 flex flex-col gap-2 border-t bg-gray-50">
                <Button className="w-full rounded-full h-11" size="lg" onClick={handleCheckout}>
                  <span>Thanh toán</span>
                  <ArrowRightIcon size={16} className="ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-gray-600"
                  onClick={clearCart}
                >
                  Xóa giỏ hàng
                </Button>
              </SheetFooter>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}