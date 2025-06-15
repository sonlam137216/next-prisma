import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Hướng dẫn thanh toán - GEM Store",
  description: "Hướng dẫn chi tiết về các phương thức thanh toán tại GEM Store",
};

export default function PaymentGuide() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Hướng dẫn thanh toán</h1>
        <p className="text-gray-600">
          GEM Store cung cấp nhiều phương thức thanh toán an toàn và tiện lợi. Dưới đây là hướng dẫn chi tiết về cách thanh toán cho đơn hàng của bạn.
        </p>
      </div>

      {/* Payment Methods */}
      <Tabs defaultValue="online" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="online">Thanh toán online</TabsTrigger>
          <TabsTrigger value="cod">Thanh toán khi nhận hàng</TabsTrigger>
          <TabsTrigger value="store">Thanh toán tại cửa hàng</TabsTrigger>
        </TabsList>

        {/* Online Payment */}
        <TabsContent value="online" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="/images/support/payment/banking-icon.png"
                        alt="Chuyển khoản ngân hàng"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Chuyển khoản ngân hàng</h3>
                      <p className="text-sm text-gray-600">Thanh toán qua chuyển khoản ngân hàng</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Ngân hàng: Vietcombank</p>
                    <p>Số tài khoản: 1234567890</p>
                    <p>Chủ tài khoản: CÔNG TY TNHH GEM</p>
                    <p>Chi nhánh: Hồ Chí Minh</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="/images/support/payment/momo-icon.png"
                        alt="Ví MoMo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Ví MoMo</h3>
                      <p className="text-sm text-gray-600">Thanh toán qua ví điện tử MoMo</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Số điện thoại: 0987654321</p>
                    <p>Tên: CÔNG TY TNHH GEM</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="/images/support/payment/vnpay-icon.png"
                        alt="VNPay"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">VNPay</h3>
                      <p className="text-sm text-gray-600">Thanh toán qua cổng thanh toán VNPay</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Hỗ trợ đa dạng ngân hàng</p>
                    <p>Thanh toán nhanh chóng, an toàn</p>
                    <p>Xác nhận giao dịch qua SMS</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="/images/support/payment/credit-card-icon.png"
                        alt="Thẻ tín dụng"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Thẻ tín dụng/ghi nợ</h3>
                      <p className="text-sm text-gray-600">Thanh toán qua thẻ Visa, Mastercard</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Chấp nhận thẻ quốc tế</p>
                    <p>Bảo mật thông tin theo chuẩn PCI DSS</p>
                    <p>Xác thực 3D Secure</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Payment Process */}
          <div className="bg-primary/5 p-6 rounded-lg mt-8">
            <h2 className="text-xl font-semibold mb-4">Quy trình thanh toán online</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <Image
                    src="/images/support/payment/step1-icon.png"
                    alt="Bước 1"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-medium mb-2">Chọn sản phẩm</h3>
                <p className="text-sm text-gray-600">Thêm sản phẩm vào giỏ hàng</p>
              </div>
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <Image
                    src="/images/support/payment/step2-icon.png"
                    alt="Bước 2"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-medium mb-2">Thanh toán</h3>
                <p className="text-sm text-gray-600">Chọn phương thức thanh toán</p>
              </div>
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <Image
                    src="/images/support/payment/step3-icon.png"
                    alt="Bước 3"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-medium mb-2">Xác nhận</h3>
                <p className="text-sm text-gray-600">Nhận email xác nhận đơn hàng</p>
              </div>
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <Image
                    src="/images/support/payment/step4-icon.png"
                    alt="Bước 4"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-medium mb-2">Nhận hàng</h3>
                <p className="text-sm text-gray-600">Kiểm tra và nhận sản phẩm</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* COD Payment */}
        <TabsContent value="cod" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Thanh toán khi nhận hàng (COD)</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Quy trình thanh toán COD</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      <li>Đặt hàng online và chọn phương thức COD</li>
                      <li>Nhận điện thoại xác nhận đơn hàng</li>
                      <li>Kiểm tra hàng khi nhận</li>
                      <li>Thanh toán tiền mặt cho nhân viên giao hàng</li>
                    </ol>
                  </CardContent>
                </Card>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-2">Lưu ý quan trọng</h3>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700">
                    <li>Chỉ áp dụng cho đơn hàng trong phạm vi nội thành</li>
                    <li>Phí vận chuyển: 30.000đ - 50.000đ tùy khu vực</li>
                    <li>Thời gian giao hàng: 1-2 ngày làm việc</li>
                    <li>Vui lòng kiểm tra kỹ hàng trước khi thanh toán</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/images/support/payment/cod-delivery.jpg"
                alt="Giao hàng COD"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </TabsContent>

        {/* Store Payment */}
        <TabsContent value="store" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Thanh toán tại cửa hàng</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Phương thức thanh toán tại cửa hàng</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Tiền mặt</li>
                      <li>Thẻ tín dụng/ghi nợ</li>
                      <li>Chuyển khoản ngân hàng</li>
                      <li>Ví điện tử (MoMo, ZaloPay)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Ưu điểm</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Được tư vấn trực tiếp</li>
                      <li>Kiểm tra sản phẩm kỹ lưỡng</li>
                      <li>Thanh toán linh hoạt</li>
                      <li>Nhận hàng ngay lập tức</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="/images/support/payment/store-payment.jpg"
                  alt="Thanh toán tại cửa hàng"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Thông tin cửa hàng</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
                  <p>Giờ mở cửa: 9:00 - 21:00 (Thứ 2 - Chủ nhật)</p>
                  <p>Hotline: 1900 1234</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Security Notice */}
      <div className="bg-primary/5 p-6 rounded-lg mt-8">
        <div className="flex items-start gap-4">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src="/images/support/payment/security-icon.png"
              alt="Bảo mật"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Bảo mật thanh toán</h2>
            <p className="text-gray-600 mb-4">
              GEM Store cam kết bảo vệ thông tin thanh toán của khách hàng với các biện pháp bảo mật tiên tiến:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Mã hóa SSL 256-bit</li>
              <li>Tuân thủ chuẩn bảo mật PCI DSS</li>
              <li>Xác thực 3D Secure cho thẻ quốc tế</li>
              <li>Không lưu trữ thông tin thẻ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 