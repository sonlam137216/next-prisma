'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, HomeIcon, PackageIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CheckoutSuccessPage() {
  // const router = useRouter();
  const [orderNumber] = useState(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  const [progress, setProgress] = useState(0);
  
  // Simulate progress bar animation
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      <div className="container max-w-lg mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-600">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
          </p>
        </motion.div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Mã đơn hàng</p>
                  <p className="font-medium">{orderNumber}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => {}}>
                  Xem chi tiết
                </Button>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Trạng thái đơn hàng</span>
                  <span className="font-medium text-green-600">Đã xác nhận</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <ClockIcon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Thời gian dự kiến</p>
                    <p className="text-gray-600 text-sm">3-5 ngày làm việc</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <PackageIcon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Phương thức vận chuyển</p>
                    <p className="text-gray-600 text-sm">Giao hàng tiêu chuẩn</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <HomeIcon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Địa chỉ giao hàng</p>
                    <p className="text-gray-600 text-sm">
                      Thông tin của bạn sẽ được hiển thị ở đây
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Bạn sẽ nhận được</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start">
                <CheckCircleIcon size={16} className="text-green-600 mr-2 mt-0.5" />
                <p>Email xác nhận đơn hàng</p>
              </div>
              <div className="flex items-start">
                <CheckCircleIcon size={16} className="text-green-600 mr-2 mt-0.5" />
                <p>Thông báo khi đơn hàng được giao</p>
              </div>
              <div className="flex items-start">
                <CheckCircleIcon size={16} className="text-green-600 mr-2 mt-0.5" />
                <p>Cập nhật trạng thái đơn hàng qua email</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/orders">
              Xem đơn hàng
            </Link>
          </Button>
          <Button className="flex-1" asChild>
            <Link href="/">
              Tiếp tục mua sắm
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}