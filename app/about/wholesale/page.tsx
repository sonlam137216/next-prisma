import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kinh doanh sỉ - GEM",
  description: "Cơ hội hợp tác kinh doanh sỉ với GEM - Thương hiệu trang sức và vật phẩm phong thủy uy tín",
};

export default function WholesalePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Kinh doanh sỉ</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Lợi ích khi hợp tác với GEM</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Chính sách giá ưu đãi</h3>
              <p className="text-gray-700">
                Hưởng mức giá đặc biệt dành cho đối tác kinh doanh sỉ, 
                tối ưu chi phí đầu vào cho doanh nghiệp của bạn.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Hỗ trợ marketing</h3>
              <p className="text-gray-700">
                Được cung cấp tài liệu marketing, hình ảnh sản phẩm chất lượng cao 
                và các chiến dịch quảng cáo đồng bộ.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Đào tạo chuyên môn</h3>
              <p className="text-gray-700">
                Được đào tạo về kiến thức sản phẩm, kỹ năng bán hàng và 
                tư vấn phong thủy chuyên nghiệp.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Hỗ trợ logistics</h3>
              <p className="text-gray-700">
                Giao hàng nhanh chóng, đúng hẹn với chi phí vận chuyển tối ưu 
                cho đối tác kinh doanh sỉ.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Điều kiện hợp tác</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>Có giấy phép kinh doanh hợp lệ</li>
            <li>Đạt doanh số đặt hàng tối thiểu theo quy định</li>
            <li>Cam kết tuân thủ chính sách phân phối của GEM</li>
            <li>Có khả năng thanh toán đúng hạn</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Quy trình hợp tác</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold">Đăng ký thông tin</h3>
                <p className="text-gray-700">Điền form đăng ký và gửi các giấy tờ cần thiết</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold">Xét duyệt hồ sơ</h3>
                <p className="text-gray-700">GEM sẽ xem xét và phản hồi trong vòng 3-5 ngày làm việc</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold">Ký kết hợp đồng</h3>
                <p className="text-gray-700">Thỏa thuận và ký kết hợp đồng hợp tác</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</div>
              <div>
                <h3 className="font-semibold">Bắt đầu hợp tác</h3>
                <p className="text-gray-700">Được cấp tài khoản đại lý và bắt đầu đặt hàng</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Liên hệ hợp tác</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              Để biết thêm thông tin chi tiết về chương trình hợp tác kinh doanh sỉ, 
              vui lòng liên hệ với chúng tôi:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Hotline: 1900 xxxx</li>
              <li>Email: wholesale@gem.com</li>
              <li>Địa chỉ: [Địa chỉ công ty]</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
} 