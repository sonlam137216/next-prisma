import Image from "next/image";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Cẩm nang sử dụng trang sức - GEM Store",
  description: "Hướng dẫn chăm sóc và bảo quản trang sức đúng cách",
};

export default function JewelryCareGuide() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Cẩm nang sử dụng trang sức</h1>
        <p className="text-gray-600">
          Trang sức của bạn sẽ luôn đẹp và bền bỉ nếu được chăm sóc đúng cách. Dưới đây là những hướng dẫn chi tiết giúp bạn bảo quản trang sức một cách tốt nhất.
        </p>
      </div>

      {/* Care Tips Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="relative h-[200px] mb-4 rounded-lg overflow-hidden">
              <Image
                src="/images/support/jewelry/cleaning.jpg"
                alt="Vệ sinh trang sức"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold mb-3">Vệ sinh trang sức</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Lau nhẹ nhàng bằng vải mềm</li>
              <li>Sử dụng nước ấm và xà phòng dịu nhẹ</li>
              <li>Tránh sử dụng hóa chất mạnh</li>
              <li>Làm khô hoàn toàn sau khi vệ sinh</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="relative h-[200px] mb-4 rounded-lg overflow-hidden">
              <Image
                src="/images/support/jewelry/storage.jpg"
                alt="Bảo quản trang sức"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold mb-3">Bảo quản trang sức</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Cất giữ trong hộp riêng biệt</li>
              <li>Tránh để các món trang sức cọ xát vào nhau</li>
              <li>Giữ nơi khô ráo, thoáng mát</li>
              <li>Tránh ánh nắng trực tiếp</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Care Guide */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Hướng dẫn chi tiết theo loại trang sức</h2>
        <Accordion type="single" collapsible className="w-full">
          {/* Gold Jewelry */}
          <AccordionItem value="gold">
            <AccordionTrigger className="text-lg font-medium">
              Trang sức vàng
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Cách vệ sinh</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Ngâm trong nước ấm pha xà phòng dịu nhẹ</li>
                      <li>Chải nhẹ bằng bàn chải mềm</li>
                      <li>Rửa sạch với nước ấm</li>
                      <li>Lau khô bằng vải mềm</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Lưu ý quan trọng</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Tránh tiếp xúc với hóa chất</li>
                      <li>Tháo ra khi bơi lội</li>
                      <li>Không đeo khi tập thể thao</li>
                      <li>Kiểm tra định kỳ tại cửa hàng</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Silver Jewelry */}
          <AccordionItem value="silver">
            <AccordionTrigger className="text-lg font-medium">
              Trang sức bạc
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Cách vệ sinh</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Sử dụng vải đánh bạc chuyên dụng</li>
                      <li>Ngâm trong nước ấm với baking soda</li>
                      <li>Chải nhẹ bằng bàn chải mềm</li>
                      <li>Lau khô kỹ lưỡng</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Lưu ý quan trọng</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Tránh tiếp xúc với nước biển</li>
                      <li>Không đeo khi tắm</li>
                      <li>Bảo quản trong túi chống oxy hóa</li>
                      <li>Vệ sinh định kỳ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Gemstone Jewelry */}
          <AccordionItem value="gemstone">
            <AccordionTrigger className="text-lg font-medium">
              Trang sức đá quý
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Cách vệ sinh</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Lau nhẹ bằng vải mềm</li>
                      <li>Sử dụng nước ấm và xà phòng dịu nhẹ</li>
                      <li>Tránh ngâm trong nước quá lâu</li>
                      <li>Lau khô cẩn thận</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Lưu ý quan trọng</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Kiểm tra độ chặt của đá</li>
                      <li>Tránh va đập mạnh</li>
                      <li>Không đeo khi làm việc nặng</li>
                      <li>Bảo dưỡng định kỳ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Professional Care */}
      <div className="bg-primary/5 p-6 rounded-lg mt-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-xl font-semibold mb-4">Dịch vụ chăm sóc chuyên nghiệp</h2>
            <p className="text-gray-600 mb-4">
              Để đảm bảo trang sức của bạn luôn trong tình trạng tốt nhất, chúng tôi cung cấp dịch vụ chăm sóc và bảo dưỡng chuyên nghiệp. Đội ngũ thợ kim hoàn giàu kinh nghiệm sẽ giúp bạn:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              <li>Kiểm tra và siết chặt đá</li>
              <li>Đánh bóng và làm mới bề mặt</li>
              <li>Vệ sinh chuyên sâu</li>
              <li>Tư vấn bảo quản</li>
            </ul>
            <Button variant="default" className="bg-primary hover:bg-primary/90">
              Đặt lịch bảo dưỡng
            </Button>
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="/images/support/jewelry/professional-care.jpg"
              alt="Dịch vụ chăm sóc chuyên nghiệp"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 