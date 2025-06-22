import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kinh doanh sỉ - GEM",
  description: "Cơ hội hợp tác kinh doanh sỉ với GEM - Thương hiệu trang sức và vật phẩm phong thủy uy tín",
};

export default function WholesalePage() {
  return (
    <div>
      {/* Banner Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-800 opacity-50 -z-10"></div>
        <div className="absolute -top-1/2 -left-1/4 w-full h-[200%] bg-white opacity-10 transform -rotate-45 -z-10"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-[200%] bg-white opacity-10 transform -rotate-45 -z-10"></div>
        
        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Hợp Tác Kinh Doanh Sỉ
          </h1>
          <p className="mt-2 text-2xl md:text-3xl font-semibold text-yellow-300">CÙNG GEM</p>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100">
            Mở rộng kinh doanh và gia tăng lợi nhuận cùng thương hiệu trang sức và vật phẩm phong thủy hàng đầu.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-700 transition-colors">
              Chính Sách Giá Ưu Đãi
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-700 transition-colors">
              Hỗ Trợ Toàn Diện
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-700 transition-colors">
              Sản Phẩm Đa Dạng
            </Button>
          </div>

          <div className="mt-10">
            <Button asChild size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 font-bold text-lg px-8 py-6 transform hover:scale-105 transition-transform">
              <Link href="/partner-registration">
                Đăng Ký Ngay
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-10">
          <section>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Lợi ích khi trở thành đối tác của GEM</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-xl mb-2 text-primary">Chính sách giá ưu đãi</h3>
                <p className="text-gray-600">
                  Hưởng mức giá sỉ đặc biệt cạnh tranh, giúp bạn tối ưu hóa lợi nhuận và chi phí đầu vào.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-xl mb-2 text-primary">Hỗ trợ marketing và bán hàng</h3>
                <p className="text-gray-600">
                  Cung cấp hình ảnh, video sản phẩm chuyên nghiệp, nội dung quảng cáo và hỗ trợ xây dựng thương hiệu tại điểm bán.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-xl mb-2 text-primary">Đào tạo chuyên sâu</h3>
                <p className="text-gray-600">
                  Tham gia các khóa đào tạo về kiến thức sản phẩm, kỹ năng bán hàng và tư vấn phong thủy từ các chuyên gia.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-xl mb-2 text-primary">Hỗ trợ vận hành & logistics</h3>
                <p className="text-gray-600">
                  Quy trình đặt hàng đơn giản, giao hàng nhanh chóng trên toàn quốc với chi phí vận chuyển tối ưu.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Điều kiện hợp tác</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-6 rounded-r-lg">
              <ul className="list-disc list-inside space-y-3">
                <li>Có giấy phép kinh doanh hợp lệ (nếu là công ty/hộ kinh doanh).</li>
                <li>Có cửa hàng, mặt bằng kinh doanh hoặc kênh bán hàng online ổn định.</li>
                <li>Đạt giá trị đơn hàng tối thiểu cho lần đầu tiên theo quy định.</li>
                <li>Cam kết tuân thủ các chính sách về giá và phân phối của GEM để đảm bảo môi trường kinh doanh lành mạnh.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Quy trình hợp tác 4 bước đơn giản</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-xl font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-lg">Đăng ký thông tin</h3>
                  <p className="text-gray-600">Hoàn thành form đăng ký online hoặc liên hệ trực tiếp qua hotline của chúng tôi.</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-xl font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-lg">Tư vấn & Xét duyệt</h3>
                  <p className="text-gray-600">Bộ phận kinh doanh của GEM sẽ liên hệ tư vấn, thẩm định và phản hồi trong vòng 3-5 ngày làm việc.</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-xl font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-lg">Ký kết hợp đồng</h3>
                  <p className="text-gray-600">Hai bên thỏa thuận các điều khoản và ký kết hợp đồng hợp tác sỉ.</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-xl font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-lg">Bắt đầu kinh doanh</h3>
                  <p className="text-gray-600">Được cấp tài khoản đại lý, lên đơn hàng đầu tiên và bắt đầu hành trình kinh doanh cùng GEM.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gray-100 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Sẵn sàng để hợp tác?</h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-6">
              Đừng ngần ngại liên hệ với chúng tôi để được tư vấn chi tiết về chính sách và bắt đầu cơ hội kinh doanh đầy tiềm năng.
            </p>
            <div className="space-y-3 text-lg">
                <p><strong>Hotline:</strong> <a href="tel:19008888" className="text-primary hover:underline">1900 8888</a></p>
                <p><strong>Email:</strong> <a href="mailto:wholesale@gem.com" className="text-primary hover:underline">wholesale@gem.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 