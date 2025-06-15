import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách đặt cọc và giao hàng - GEM Store",
  description: "Thông tin chi tiết về chính sách đặt cọc và giao hàng của GEM Store",
};

export default function DepositShippingPolicy() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Chính sách đặt cọc và giao hàng</h1>
        <p className="text-gray-600">
          GEM Store cam kết mang đến dịch vụ giao hàng nhanh chóng và an toàn. Dưới đây là chính sách đặt cọc và giao hàng chi tiết của chúng tôi.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Chính sách đặt cọc */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Chính sách đặt cọc</h2>
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Sản phẩm có sẵn:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Không yêu cầu đặt cọc</li>
                <li>Thanh toán toàn bộ khi nhận hàng</li>
                <li>Có thể thanh toán trước qua các phương thức online</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Sản phẩm đặt hàng theo yêu cầu:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Đặt cọc 30% giá trị đơn hàng</li>
                <li>Thanh toán số tiền còn lại khi nhận hàng</li>
                <li>Thời gian hoàn trả đặt cọc: 3-5 ngày làm việc nếu hủy đơn hàng</li>
                <li>Không hoàn trả đặt cọc nếu hủy đơn hàng sau khi đã bắt đầu sản xuất</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Phương thức vận chuyển */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Phương thức vận chuyển</h2>
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Giao hàng nhanh:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Áp dụng cho đơn hàng trong nội thành TP.HCM</li>
                <li>Thời gian giao hàng: 1-2 giờ</li>
                <li>Phí vận chuyển: 30.000đ</li>
                <li>Miễn phí vận chuyển cho đơn hàng từ 2.000.000đ</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Giao hàng tiêu chuẩn:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Áp dụng cho đơn hàng toàn quốc</li>
                <li>Thời gian giao hàng: 1-3 ngày làm việc</li>
                <li>Phí vận chuyển: 40.000đ</li>
                <li>Miễn phí vận chuyển cho đơn hàng từ 3.000.000đ</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Giao hàng đặc biệt:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Áp dụng cho sản phẩm có giá trị cao</li>
                <li>Bảo hiểm đặc biệt cho sản phẩm</li>
                <li>Nhân viên giao hàng chuyên nghiệp</li>
                <li>Phí vận chuyển: Liên hệ để được tư vấn</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Thời gian giao hàng */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Thời gian giao hàng</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Nội thành TP.HCM: 1-2 ngày làm việc</li>
              <li>Các tỉnh thành khác: 2-4 ngày làm việc</li>
              <li>Khu vực miền núi, hải đảo: 4-7 ngày làm việc</li>
              <li>Thời gian giao hàng có thể thay đổi tùy thuộc vào điều kiện thời tiết và địa hình</li>
            </ul>
          </div>
        </section>

        {/* Theo dõi đơn hàng */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Theo dõi đơn hàng</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Theo dõi trạng thái đơn hàng qua website hoặc ứng dụng</li>
              <li>Nhận thông báo qua SMS và email</li>
              <li>Liên hệ hotline để được hỗ trợ: 1900 1234</li>
              <li>Thời gian hỗ trợ: 8:00 - 20:00 (Thứ 2 - Chủ nhật)</li>
            </ul>
          </div>
        </section>

        {/* Lưu ý quan trọng */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Lưu ý quan trọng</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Kiểm tra kỹ sản phẩm trước khi nhận hàng</li>
              <li>Yêu cầu hóa đơn và phiếu bảo hành khi nhận hàng</li>
              <li>Thông báo ngay cho chúng tôi nếu có bất kỳ vấn đề nào</li>
              <li>Giữ lại hộp đựng và phụ kiện đi kèm trong trường hợp cần đổi trả</li>
            </ul>
          </div>
        </section>

        {/* Liên hệ hỗ trợ */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Cần hỗ trợ thêm?</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-gray-600 mb-4">
              Nếu bạn cần hỗ trợ thêm về chính sách đặt cọc và giao hàng, vui lòng liên hệ với chúng tôi:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Hotline: 1900 1234</li>
              <li>Email: support@gemstore.com</li>
              <li>Giờ làm việc: 8:00 - 20:00 (Thứ 2 - Chủ nhật)</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
} 