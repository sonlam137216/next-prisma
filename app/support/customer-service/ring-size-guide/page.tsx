import Image from "next/image";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Hướng dẫn đo size trang sức - GEM Store",
  description: "Hướng dẫn chi tiết cách đo size trang sức tại GEM Store",
};

export default function RingSizeGuide() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Hướng dẫn đo size trang sức</h1>
        <p className="text-gray-600">
          Để chọn được trang sức vừa vặn, hãy tham khảo hướng dẫn đo size dưới đây. Chúng tôi sẽ hướng dẫn bạn cách đo chính xác nhất để có được trải nghiệm mua sắm tốt nhất.
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="ring" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="ring">Nhẫn</TabsTrigger>
          <TabsTrigger value="bracelet">Vòng tay</TabsTrigger>
          <TabsTrigger value="necklace">Vòng cổ</TabsTrigger>
        </TabsList>

        {/* Ring Size Guide */}
        <TabsContent value="ring" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Cách đo size nhẫn</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Phương pháp 1: Sử dụng dây</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      <li>Quấn một sợi dây mảnh quanh ngón tay</li>
                      <li>Đánh dấu điểm giao nhau</li>
                      <li>Đo chiều dài từ điểm đánh dấu</li>
                      <li>Tra bảng quy đổi size nhẫn</li>
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Phương pháp 2: Sử dụng thước dây</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      <li>Quấn thước dây quanh ngón tay</li>
                      <li>Đọc số đo chu vi ngón tay</li>
                      <li>Tra bảng quy đổi size nhẫn</li>
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/images/support/sizing/ring-guide.jpg"
                alt="Hướng dẫn đo size nhẫn"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Size Chart */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Bảng quy đổi size nhẫn</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2">Size</th>
                    <th className="border p-2">Chu vi (mm)</th>
                    <th className="border p-2">Đường kính (mm)</th>
                    <th className="border p-2">Size US</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: "5", circumference: "49.3", diameter: "15.7", us: "5" },
                    { size: "6", circumference: "51.9", diameter: "16.5", us: "6" },
                    { size: "7", circumference: "54.4", diameter: "17.3", us: "7" },
                    { size: "8", circumference: "57.0", diameter: "18.1", us: "8" },
                    { size: "9", circumference: "59.5", diameter: "18.9", us: "9" },
                    { size: "10", circumference: "62.1", diameter: "19.8", us: "10" },
                  ].map((row) => (
                    <tr key={row.size} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{row.size}</td>
                      <td className="border p-2 text-center">{row.circumference}</td>
                      <td className="border p-2 text-center">{row.diameter}</td>
                      <td className="border p-2 text-center">{row.us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-primary/5 p-6 rounded-lg mt-8">
            <h2 className="text-xl font-semibold mb-4">Lưu ý quan trọng</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Nên đo size vào cuối ngày khi ngón tay đạt kích thước lớn nhất</li>
              <li>Tránh đo khi trời quá lạnh hoặc quá nóng</li>
              <li>Nếu giữa các size, nên chọn size lớn hơn</li>
              <li>Đối với nhẫn có đá, nên chọn size lớn hơn 0.5 size so với nhẫn trơn</li>
            </ul>
          </div>
        </TabsContent>

        {/* Bracelet Size Guide */}
        <TabsContent value="bracelet" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Cách đo size vòng tay</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Phương pháp đo vòng tay</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      <li>Đo chu vi cổ tay bằng thước dây</li>
                      <li>Thêm 1-2cm để có độ thoải mái</li>
                      <li>Tra bảng size vòng tay</li>
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/images/support/sizing/bracelet-guide.jpg"
                alt="Hướng dẫn đo size vòng tay"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </TabsContent>

        {/* Necklace Size Guide */}
        <TabsContent value="necklace" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Cách chọn size vòng cổ</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Các size vòng cổ phổ biến</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Vòng cổ choker: 35-40cm</li>
                      <li>Vòng cổ ngắn: 40-45cm</li>
                      <li>Vòng cổ trung bình: 45-50cm</li>
                      <li>Vòng cổ dài: 50-60cm</li>
                      <li>Vòng cổ opera: 70-90cm</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/images/support/sizing/necklace-guide.jpg"
                alt="Hướng dẫn chọn size vòng cổ"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Contact Support */}
      <div className="bg-primary/5 p-6 rounded-lg mt-8">
        <h2 className="text-xl font-semibold mb-4">Cần hỗ trợ thêm?</h2>
        <p className="text-gray-600 mb-4">
          Nếu bạn cần hỗ trợ thêm về việc đo size trang sức, đừng ngần ngại liên hệ với chúng tôi.
        </p>
        <Button variant="default" className="bg-primary hover:bg-primary/90">
          Liên hệ hỗ trợ
        </Button>
      </div>
    </div>
  );
} 