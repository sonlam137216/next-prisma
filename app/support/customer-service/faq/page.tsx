import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp - GEM Store",
  description: "Giải đáp các câu hỏi thường gặp về sản phẩm, dịch vụ và chính sách của GEM Store",
};

export default function FAQ() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Câu hỏi thường gặp</h1>
        <p className="text-gray-600">
          Tìm câu trả lời cho những thắc mắc phổ biến về sản phẩm, dịch vụ và chính sách của GEM Store.
        </p>
      </div>

      {/* Search FAQ */}
      <div className="bg-primary/5 p-6 rounded-lg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-semibold mb-4">Không tìm thấy câu trả lời?</h2>
          <p className="text-gray-600 mb-6">
            Hãy liên hệ với chúng tôi để được hỗ trợ nhanh chóng
          </p>
          <Button variant="default" className="bg-primary hover:bg-primary/90">
            Liên hệ hỗ trợ
          </Button>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {/* Sản phẩm */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="product-1">
              <AccordionTrigger className="text-lg">
                Làm thế nào để chọn size trang sức phù hợp?
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-600 space-y-2">
                  <p>Để chọn size trang sức phù hợp, bạn có thể:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Tham khảo hướng dẫn đo size trên website</li>
                    <li>Đến cửa hàng để được nhân viên tư vấn và đo size</li>
                    <li>Sử dụng công cụ đo size online của chúng tôi</li>
                  </ul>
                  <p className="mt-2">
                    <a href="/support/customer-service/ring-size-guide" className="text-primary hover:underline">
                      Xem hướng dẫn chi tiết về cách đo size
                    </a>
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="product-2">
              <AccordionTrigger className="text-lg">
                Làm sao để phân biệt trang sức thật và giả?
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-600 space-y-2">
                  <p>Tất cả sản phẩm tại GEM Store đều:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Có giấy kiểm định chất lượng</li>
                    <li>Được bảo hành chính hãng</li>
                    <li>Có tem chống giả</li>
                    <li>Được kiểm định bởi các tổ chức uy tín</li>
                  </ul>
                  <p className="mt-2">
                    Bạn có thể kiểm tra tính xác thực của sản phẩm thông qua mã QR trên tem hoặc liên hệ với chúng tôi để được hỗ trợ.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="product-3">
              <AccordionTrigger className="text-lg">
                Có thể đặt hàng theo yêu cầu không?
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-600 space-y-2">
                  <p>GEM Store cung cấp dịch vụ thiết kế và chế tác theo yêu cầu:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Thiết kế riêng theo ý tưởng của khách hàng</li>
                    <li>Chọn chất liệu và đá quý theo yêu cầu</li>
                    <li>Điều chỉnh kích thước và kiểu dáng</li>
                    <li>Bảo hành và bảo trì trọn đời</li>
                  </ul>
                  <p className="mt-2">
                    Để biết thêm chi tiết, vui lòng liên hệ với chúng tôi qua hotline hoặc đến trực tiếp cửa hàng.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Đặt hàng & Thanh toán */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Đặt hàng & Thanh toán</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="order-1">
              <AccordionTrigger className="text-lg">
                Các phương thức thanh toán được chấp nhận?
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-600 space-y-2">
                  <p>GEM Store chấp nhận các phương thức thanh toán sau:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Chuyển khoản ngân hàng</li>
                    <li>Thẻ tín dụng/ghi nợ</li>
                    <li>Ví điện tử (MoMo, ZaloPay)</li>
                    <li>Thanh toán khi nhận hàng (COD)</li>
                    <li>Tiền mặt tại cửa hàng</li>
                  </ul>
                  <p className="mt-2">
                    <a href="/support/customer-service/payment-guide" className="text-primary hover:underline">
                      Xem chi tiết về hướng dẫn thanh toán
                    </a>
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="order-2">
              <AccordionTrigger className="text-lg">
                Thời gian giao hàng là bao lâu?
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-600 space-y-2">
                  <p>Thời gian giao hàng phụ thuộc vào phương thức vận chuyển và địa điểm:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Nội thành TP.HCM: 1-2 ngày làm việc</li>
                    <li>Các tỉnh thành khác: 2-4 ngày làm việc</li>
                    <li>Khu vực miền núi, hải đảo: 4-7 ngày làm việc</li>
                  </ul>
                  <p className="mt-2">
                    Đối với sản phẩm đặt hàng theo yêu cầu, thời gian giao hàng sẽ được thông báo cụ thể khi đặt hàng.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Chính sách & Bảo hành */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Chính sách & Bảo hành</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="policy-1">
              <AccordionTrigger className="text-lg">
                Chính sách đổi trả như thế nào?
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-600 space-y-2">
                  <p>GEM Store áp dụng chính sách đổi trả trong vòng 7 ngày kể từ ngày nhận hàng:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Sản phẩm còn nguyên tem, mác</li>
                    <li>Không có dấu hiệu sử dụng</li>
                    <li>Giữ nguyên hóa đơn mua hàng</li>
                    <li>Không áp dụng cho sản phẩm đặt hàng theo yêu cầu</li>
                  </ul>
                  <p className="mt-2">
                    <a href="/support/policies/return-policy" className="text-primary hover:underline">
                      Xem chi tiết chính sách đổi trả
                    </a>
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="policy-2">
              <AccordionTrigger className="text-lg">
                Thời gian bảo hành là bao lâu?
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-600 space-y-2">
                  <p>GEM Store cung cấp chính sách bảo hành như sau:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Trang sức vàng, bạc: Bảo hành trọn đời</li>
                    <li>Đá quý tự nhiên: Bảo hành 1 năm</li>
                    <li>Đá nhân tạo: Bảo hành 6 tháng</li>
                    <li>Dịch vụ đánh bóng, làm mới: Miễn phí trọn đời</li>
                  </ul>
                  <p className="mt-2">
                    <a href="/support/policies/warranty" className="text-primary hover:underline">
                      Xem chi tiết chính sách bảo hành
                    </a>
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-primary/5 p-6 rounded-lg mt-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Vẫn chưa tìm thấy câu trả lời?</h2>
          <p className="text-gray-600 mb-6">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" className="bg-primary hover:bg-primary/90">
              Gọi hotline: 1900 1234
            </Button>
            <Button variant="outline">
              Chat với chúng tôi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 