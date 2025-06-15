import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Thông tin cửa hàng - GEM",
  description: "Thông tin về hệ thống cửa hàng của GEM - Địa chỉ, giờ mở cửa và liên hệ",
};

export default function StoreInfoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Thông tin cửa hàng</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Hệ thống cửa hàng</h2>
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-2">GEM Hà Nội</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Địa chỉ:</span> 123 Nguyễn Huệ, Hoàn Kiếm, Hà Nội
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Điện thoại:</span> (024) 1234 5678
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Giờ mở cửa:</span> 9:00 - 21:00
                  </p>
                </div>
                <div className="relative h-48">
                  <Image
                    src="/images/store-hanoi.jpg"
                    alt="GEM Hà Nội"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-2">GEM Hồ Chí Minh</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Địa chỉ:</span> 456 Lê Lợi, Quận 1, TP.HCM
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Điện thoại:</span> (028) 8765 4321
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Giờ mở cửa:</span> 9:00 - 21:00
                  </p>
                </div>
                <div className="relative h-48">
                  <Image
                    src="/images/store-hcm.jpg"
                    alt="GEM Hồ Chí Minh"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-2">GEM Đà Nẵng</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Địa chỉ:</span> 789 Nguyễn Văn Linh, Hải Châu, Đà Nẵng
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Điện thoại:</span> (0236) 9876 5432
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Giờ mở cửa:</span> 9:00 - 21:00
                  </p>
                </div>
                <div className="relative h-48">
                  <Image
                    src="/images/store-danang.jpg"
                    alt="GEM Đà Nẵng"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Dịch vụ tại cửa hàng</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Tư vấn trực tiếp</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Tư vấn chọn trang sức phù hợp</li>
                <li>Hướng dẫn chăm sóc sản phẩm</li>
                <li>Tư vấn phong thủy chuyên sâu</li>
                <li>Đo size nhẫn miễn phí</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Dịch vụ bảo trì</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Kiểm tra và vệ sinh sản phẩm</li>
                <li>Đánh bóng và làm mới</li>
                <li>Thay đổi kích thước nhẫn</li>
                <li>Sửa chữa và bảo hành</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Bản đồ</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0964843003007!2d105.85315931531073!3d21.02881678599471!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab8ea079c829%3A0x1a3ebe79efa873b2!2zMTIzIE5ndXnhu4VuIEh14bqtbiwgVGhhbmgsIEjDoCBO4buZaSwgSMOgIE7hu5lpLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1647881234567!5m2!1sen!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Liên hệ</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Tổng đài hỗ trợ</h3>
                <p className="text-gray-700">1900 xxxx (8:00 - 22:00)</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <p className="text-gray-700">info@gem.com</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Mạng xã hội</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-700 hover:text-primary">Facebook</a>
                  <a href="#" className="text-gray-700 hover:text-primary">Instagram</a>
                  <a href="#" className="text-gray-700 hover:text-primary">YouTube</a>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Zalo</h3>
                <p className="text-gray-700">GEM Official</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 