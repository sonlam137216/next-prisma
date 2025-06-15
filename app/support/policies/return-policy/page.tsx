import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách đổi trả - GEM Store",
  description: "Thông tin chi tiết về chính sách đổi trả và hoàn tiền của GEM Store",
};

export default function ReturnPolicy() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Chính sách đổi trả</h1>
        <p className="text-gray-600">
          GEM Store cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng. Dưới đây là chính sách đổi trả chi tiết của chúng tôi.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Thời gian đổi trả */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Thời gian đổi trả</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Thời gian đổi trả: 7 ngày kể từ ngày nhận hàng</li>
              <li>Thời gian hoàn tiền: 3-5 ngày làm việc sau khi nhận được sản phẩm trả về</li>
              <li>Áp dụng cho tất cả sản phẩm có sẵn tại cửa hàng</li>
              <li>Không áp dụng cho sản phẩm đặt hàng theo yêu cầu</li>
            </ul>
          </div>
        </section>

        {/* Điều kiện đổi trả */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Điều kiện đổi trả</h2>
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Sản phẩm đủ điều kiện đổi trả:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Còn nguyên tem, mác, hộp đựng và tất cả phụ kiện đi kèm</li>
                <li>Không có dấu hiệu sử dụng, trầy xước hoặc hư hỏng</li>
                <li>Còn nguyên hóa đơn mua hàng</li>
                <li>Sản phẩm không nằm trong danh mục không được đổi trả</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Sản phẩm không đủ điều kiện đổi trả:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Sản phẩm đã qua sử dụng hoặc có dấu hiệu hư hỏng</li>
                <li>Sản phẩm đặt hàng theo yêu cầu</li>
                <li>Sản phẩm đã hết thời gian đổi trả</li>
                <li>Sản phẩm không còn nguyên tem, mác hoặc phụ kiện đi kèm</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quy trình đổi trả */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Quy trình đổi trả</h2>
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Bước 1: Liên hệ hỗ trợ</h3>
              <p className="text-gray-600">
                Liên hệ với chúng tôi qua hotline hoặc email để thông báo về việc đổi trả sản phẩm.
              </p>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Bước 2: Chuẩn bị sản phẩm</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Đóng gói sản phẩm cẩn thận với đầy đủ phụ kiện</li>
                <li>Kèm theo hóa đơn mua hàng</li>
                <li>Ghi rõ lý do đổi trả</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Bước 3: Gửi sản phẩm</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Gửi sản phẩm về địa chỉ cửa hàng</li>
                <li>Hoặc mang trực tiếp đến cửa hàng</li>
                <li>Lưu ý: Chi phí vận chuyển sẽ do khách hàng chịu trách nhiệm</li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Bước 4: Xử lý đổi trả</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Kiểm tra sản phẩm trong vòng 24-48 giờ</li>
                <li>Thông báo kết quả kiểm tra cho khách hàng</li>
                <li>Tiến hành đổi sản phẩm hoặc hoàn tiền</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Chính sách hoàn tiền */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Chính sách hoàn tiền</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Hoàn tiền qua phương thức thanh toán ban đầu</li>
              <li>Thời gian xử lý: 3-5 ngày làm việc</li>
              <li>Phí vận chuyển không được hoàn lại</li>
              <li>Trường hợp đổi sản phẩm có giá trị cao hơn, khách hàng cần thanh toán thêm phần chênh lệch</li>
            </ul>
          </div>
        </section>

        {/* Liên hệ hỗ trợ */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Cần hỗ trợ thêm?</h2>
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-gray-600 mb-4">
              Nếu bạn cần hỗ trợ thêm về chính sách đổi trả, vui lòng liên hệ với chúng tôi:
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