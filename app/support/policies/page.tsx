import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách GEM - GEM",
  description: "Thông tin về các chính sách của GEM - Đảm bảo quyền lợi và trải nghiệm tốt nhất cho khách hàng",
};

export default function PoliciesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Chính sách GEM</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Chính sách bảo mật</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              GEM cam kết bảo vệ thông tin cá nhân của khách hàng theo các nguyên tắc sau:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Thu thập thông tin có sự đồng ý của khách hàng</li>
              <li>Chỉ sử dụng thông tin cho mục đích phục vụ khách hàng</li>
              <li>Không chia sẻ thông tin cho bên thứ ba</li>
              <li>Bảo mật thông tin thanh toán</li>
              <li>Tuân thủ quy định về bảo vệ dữ liệu cá nhân</li>
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Chính sách đổi trả</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Điều kiện đổi trả</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li>
                <li>Còn đầy đủ hộp, giấy tờ và phụ kiện đi kèm</li>
                <li>Trong thời hạn 30 ngày kể từ ngày mua</li>
                <li>Có hóa đơn mua hàng hợp lệ</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Quy trình đổi trả</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Liên hệ bộ phận chăm sóc khách hàng</li>
                <li>Kiểm tra điều kiện đổi trả</li>
                <li>Hoàn tất thủ tục đổi trả</li>
                <li>Nhận sản phẩm mới hoặc hoàn tiền</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Chính sách vận chuyển</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Phương thức vận chuyển</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Giao hàng toàn quốc</li>
                <li>Vận chuyển nhanh trong nội thành</li>
                <li>Giao hàng miễn phí cho đơn từ 2 triệu đồng</li>
                <li>Hỗ trợ giao hàng quốc tế</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Thời gian giao hàng</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Nội thành: 1-2 ngày làm việc</li>
                <li>Tỉnh thành khác: 2-3 ngày làm việc</li>
                <li>Vùng xa: 3-5 ngày làm việc</li>
                <li>Quốc tế: 5-7 ngày làm việc</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Chính sách thanh toán</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Phương thức thanh toán</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Thanh toán khi nhận hàng (COD)</li>
                <li>Chuyển khoản ngân hàng</li>
                <li>Thẻ tín dụng/ghi nợ</li>
                <li>Ví điện tử (Momo, ZaloPay, VNPay)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Bảo mật thanh toán</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Mã hóa thông tin thanh toán</li>
                <li>Xác thực giao dịch an toàn</li>
                <li>Bảo vệ thông tin thẻ</li>
                <li>Tuân thủ tiêu chuẩn bảo mật quốc tế</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Chính sách bảo hành</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Thời hạn bảo hành</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Bảo hành chất lượng: 12 tháng</li>
                <li>Bảo trì trọn đời</li>
                <li>Bảo hành đá quý: Theo chứng nhận</li>
                <li>Bảo hành kim loại: Theo tiêu chuẩn</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Phạm vi bảo hành</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Sửa chữa lỗi kỹ thuật</li>
                <li>Thay thế linh kiện</li>
                <li>Đánh bóng và làm mới</li>
                <li>Kiểm tra định kỳ</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 