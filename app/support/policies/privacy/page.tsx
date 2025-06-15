import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật - GEM Store",
  description: "Thông tin chi tiết về chính sách bảo mật và xử lý thông tin cá nhân của GEM Store",
};

export default function PrivacyPolicy() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Chính sách bảo mật</h1>
        <p className="text-gray-600">
          GEM Store cam kết bảo vệ thông tin cá nhân của khách hàng. Dưới đây là chính sách bảo mật chi tiết của chúng tôi.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Thông tin thu thập */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Thông tin chúng tôi thu thập</h2>
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Thông tin cá nhân:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Họ tên, địa chỉ, số điện thoại, email</li>
                <li>Thông tin thanh toán</li>
                <li>Thông tin đơn hàng và giao dịch</li>
                <li>Thông tin tài khoản (nếu đăng ký)</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Thông tin tự động:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Địa chỉ IP và thông tin trình duyệt</li>
                <li>Thông tin thiết bị truy cập</li>
                <li>Dữ liệu cookie và tương tác</li>
                <li>Thông tin vị trí (nếu được cho phép)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Mục đích sử dụng */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Mục đích sử dụng thông tin</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Xử lý đơn hàng và giao dịch</li>
              <li>Cung cấp dịch vụ và hỗ trợ khách hàng</li>
              <li>Gửi thông tin về sản phẩm và khuyến mãi</li>
              <li>Cải thiện trải nghiệm người dùng</li>
              <li>Phòng chống gian lận và bảo mật</li>
              <li>Tuân thủ quy định pháp luật</li>
            </ul>
          </div>
        </section>

        {/* Bảo mật thông tin */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Bảo mật thông tin</h2>
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Biện pháp bảo mật:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Mã hóa dữ liệu nhạy cảm</li>
                <li>Bảo vệ bằng tường lửa và SSL</li>
                <li>Kiểm soát truy cập nghiêm ngặt</li>
                <li>Đào tạo nhân viên về bảo mật</li>
                <li>Giám sát và cập nhật thường xuyên</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Lưu trữ thông tin:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Lưu trữ an toàn trên máy chủ bảo mật</li>
                <li>Tuân thủ quy định về lưu trữ dữ liệu</li>
                <li>Xóa thông tin khi không còn cần thiết</li>
                <li>Backup dữ liệu định kỳ</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Chia sẻ thông tin */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Chia sẻ thông tin</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Chỉ chia sẻ với đối tác cần thiết để thực hiện dịch vụ</li>
              <li>Tuân thủ quy định về bảo mật của đối tác</li>
              <li>Không bán hoặc cho thuê thông tin cá nhân</li>
              <li>Chia sẻ khi có yêu cầu từ cơ quan pháp luật</li>
            </ul>
          </div>
        </section>

        {/* Quyền của khách hàng */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Quyền của khách hàng</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Truy cập và xem thông tin cá nhân</li>
              <li>Yêu cầu sửa đổi thông tin không chính xác</li>
              <li>Yêu cầu xóa thông tin cá nhân</li>
              <li>Rút lại sự đồng ý về việc sử dụng thông tin</li>
              <li>Khiếu nại về việc xử lý thông tin</li>
            </ul>
          </div>
        </section>

        {/* Cookie và công nghệ tương tự */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Cookie và công nghệ tương tự</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Sử dụng cookie để cải thiện trải nghiệm</li>
              <li>Cookie cần thiết cho hoạt động website</li>
              <li>Cookie phân tích và quảng cáo</li>
              <li>Khách hàng có thể kiểm soát cài đặt cookie</li>
            </ul>
          </div>
        </section>

        {/* Cập nhật chính sách */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Cập nhật chính sách</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Chính sách có thể được cập nhật định kỳ</li>
              <li>Thông báo khi có thay đổi quan trọng</li>
              <li>Tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận thay đổi</li>
              <li>Ngày cập nhật gần nhất: 01/03/2024</li>
            </ul>
          </div>
        </section>

        {/* Liên hệ */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Liên hệ</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-gray-600 mb-4">
              Nếu bạn có thắc mắc về chính sách bảo mật, vui lòng liên hệ với chúng tôi:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Email: privacy@gemstore.com</li>
              <li>Hotline: 1900 1234</li>
              <li>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
} 