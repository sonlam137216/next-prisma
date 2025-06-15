import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo hành - GEM Store",
  description: "Thông tin chi tiết về chính sách bảo hành sản phẩm của GEM Store",
};

export default function WarrantyPolicy() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Chính sách bảo hành</h1>
        <p className="text-gray-600">
          GEM Store cam kết mang đến sản phẩm chất lượng cao với chính sách bảo hành toàn diện. Dưới đây là thông tin chi tiết về chính sách bảo hành của chúng tôi.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Thời gian bảo hành */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Thời gian bảo hành</h2>
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Trang sức vàng, bạc:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Bảo hành trọn đời</li>
                <li>Bao gồm: đánh bóng, làm mới, sửa chữa hư hỏng</li>
                <li>Không bao gồm: thay đổi kích thước, thiết kế lại</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Đá quý tự nhiên:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Bảo hành 1 năm</li>
                <li>Bao gồm: kiểm tra chất lượng, làm sạch</li>
                <li>Không bao gồm: hư hỏng do va đập mạnh</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Đá nhân tạo:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Bảo hành 6 tháng</li>
                <li>Bao gồm: thay thế đá bị vỡ, bong tróc</li>
                <li>Không bao gồm: hư hỏng do sử dụng không đúng cách</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Phạm vi bảo hành */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Phạm vi bảo hành</h2>
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Được bảo hành:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Lỗi kỹ thuật từ nhà sản xuất</li>
                <li>Hư hỏng do chất lượng sản phẩm</li>
                <li>Đá quý bị vỡ, bong tróc không do va đập</li>
                <li>Mạ bạc bị phai màu trong thời gian bảo hành</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Không được bảo hành:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Hư hỏng do va đập mạnh</li>
                <li>Hư hỏng do sử dụng không đúng cách</li>
                <li>Hư hỏng do tự sửa chữa</li>
                <li>Hư hỏng do tiếp xúc với hóa chất</li>
                <li>Sản phẩm không còn tem bảo hành</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quy trình bảo hành */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Quy trình bảo hành</h2>
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Bước 1: Kiểm tra sản phẩm</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Kiểm tra tem bảo hành</li>
                <li>Xác định tình trạng hư hỏng</li>
                <li>Đánh giá khả năng bảo hành</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Bước 2: Xác nhận bảo hành</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Thông báo kết quả kiểm tra</li>
                <li>Ước tính thời gian sửa chữa</li>
                <li>Xác nhận chi phí (nếu có)</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Bước 3: Sửa chữa</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Thực hiện sửa chữa theo quy trình</li>
                <li>Kiểm tra chất lượng sau sửa chữa</li>
                <li>Đóng gói và bảo quản cẩn thận</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Bước 4: Trả sản phẩm</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Thông báo khi sản phẩm sẵn sàng</li>
                <li>Kiểm tra và xác nhận với khách hàng</li>
                <li>Hoàn tất thủ tục bảo hành</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Dịch vụ bảo trì */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Dịch vụ bảo trì</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Đánh bóng miễn phí trọn đời</li>
              <li>Làm sạch và kiểm tra định kỳ</li>
              <li>Tư vấn cách bảo quản và sử dụng</li>
              <li>Kiểm tra độ chính xác của đá quý</li>
            </ul>
          </div>
        </section>

        {/* Lưu ý quan trọng */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Lưu ý quan trọng</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Giữ lại hóa đơn mua hàng và phiếu bảo hành</li>
              <li>Không tự ý sửa chữa hoặc thay đổi sản phẩm</li>
              <li>Vệ sinh và bảo quản sản phẩm đúng cách</li>
              <li>Thông báo ngay khi phát hiện vấn đề</li>
            </ul>
          </div>
        </section>

        {/* Liên hệ hỗ trợ */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Cần hỗ trợ thêm?</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-gray-600 mb-4">
              Nếu bạn cần hỗ trợ thêm về chính sách bảo hành, vui lòng liên hệ với chúng tôi:
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