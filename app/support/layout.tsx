import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hỗ trợ khách hàng - GEM Store",
  description: "Hỗ trợ khách hàng và chính sách của GEM Store",
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[200px] bg-primary">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full max-w-[1400px] mx-auto px-4 flex items-center">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Hỗ trợ khách hàng</h1>
            <p className="text-white/80">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-1">
                <h3 className="font-semibold text-primary mb-3 px-2">Dịch vụ khách hàng</h3>
                <a href="/support/customer-service/ring-size-guide" className="block px-2 py-2 text-sm hover:bg-primary/5 hover:text-primary rounded-md transition-colors">
                  Hướng dẫn đo size trang sức
                </a>
                <a href="/support/customer-service/jewelry-care-guide" className="block px-2 py-2 text-sm hover:bg-primary/5 hover:text-primary rounded-md transition-colors">
                  Cẩm nang sử dụng trang sức
                </a>
                <a href="/support/customer-service/payment-guide" className="block px-2 py-2 text-sm hover:bg-primary/5 hover:text-primary rounded-md transition-colors">
                  Hướng dẫn thanh toán
                </a>
                <a href="/support/customer-service/faq" className="block px-2 py-2 text-sm hover:bg-primary/5 hover:text-primary rounded-md transition-colors">
                  Câu hỏi thường gặp
                </a>

                <h3 className="font-semibold text-primary mb-3 mt-6 px-2">Chính sách GEM</h3>
                <a href="/support/policies/return-policy" className="block px-2 py-2 text-sm hover:bg-primary/5 hover:text-primary rounded-md transition-colors">
                  Chính sách đổi trả
                </a>
                <a href="/support/policies/deposit-shipping" className="block px-2 py-2 text-sm hover:bg-primary/5 hover:text-primary rounded-md transition-colors">
                  Chính sách đặt cọc và giao hàng
                </a>
                <a href="/support/policies/warranty" className="block px-2 py-2 text-sm hover:bg-primary/5 hover:text-primary rounded-md transition-colors">
                  Chính sách bảo hành
                </a>
                <a href="/support/policies/privacy" className="block px-2 py-2 text-sm hover:bg-primary/5 hover:text-primary rounded-md transition-colors">
                  Chính sách bảo mật
                </a>

                <a href="/support/store-info" className="block px-2 py-2 text-sm hover:bg-primary/5 hover:text-primary rounded-md transition-colors mt-6">
                  Thông tin cửa hàng
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 