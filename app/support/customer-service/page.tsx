import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dịch vụ khách hàng - GEM",
  description: "Thông tin về các dịch vụ chăm sóc khách hàng của GEM - Hỗ trợ tận tâm, chuyên nghiệp",
};

export default function CustomerServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Dịch vụ khách hàng</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Hỗ trợ trực tuyến</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Tư vấn sản phẩm</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Tư vấn chọn trang sức phù hợp</li>
                <li>Hướng dẫn chăm sóc sản phẩm</li>
                <li>Tư vấn phong thủy chuyên sâu</li>
                <li>Giải đáp thắc mắc về sản phẩm</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Hỗ trợ đặt hàng</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Hướng dẫn đặt hàng online</li>
                <li>Hỗ trợ thanh toán</li>
                <li>Theo dõi đơn hàng</li>
                <li>Giải quyết vấn đề đặt hàng</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Dịch vụ sau bán hàng</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Bảo hành và bảo trì</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Kiểm tra và vệ sinh sản phẩm miễn phí</li>
                <li>Bảo hành sửa chữa</li>
                <li>Đánh bóng và làm mới sản phẩm</li>
                <li>Thay đổi kích thước nhẫn</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Đổi trả và hoàn tiền</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Chính sách đổi trả trong 30 ngày</li>
                <li>Hoàn tiền nếu không hài lòng</li>
                <li>Bảo hành chất lượng sản phẩm</li>
                <li>Hỗ trợ vận chuyển đổi trả</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Liên hệ hỗ trợ</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Hotline hỗ trợ</h3>
                <p className="text-gray-700">1900 xxxx (8:00 - 22:00)</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Email hỗ trợ</h3>
                <p className="text-gray-700">support@gem.com</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Chat trực tuyến</h3>
                <p className="text-gray-700">Hỗ trợ 24/7 qua Zalo, Facebook</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Fanpage</h3>
                <p className="text-gray-700">facebook.com/gemstore</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Câu hỏi thường gặp</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Làm thế nào để đặt hàng online?</h3>
              <p className="text-gray-700">
                Bạn có thể đặt hàng thông qua website của chúng tôi hoặc liên hệ trực tiếp 
                qua hotline để được hỗ trợ đặt hàng.
              </p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Thời gian giao hàng là bao lâu?</h3>
              <p className="text-gray-700">
                Thời gian giao hàng từ 1-3 ngày làm việc tùy thuộc vào khu vực của bạn.
              </p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Chính sách bảo hành như thế nào?</h3>
              <p className="text-gray-700">
                Tất cả sản phẩm của GEM đều được bảo hành 12 tháng về chất lượng và 
                được hỗ trợ bảo trì trọn đời.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 