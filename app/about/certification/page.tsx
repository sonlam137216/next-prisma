import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kiểm định - GEM",
  description: "Quy trình kiểm định và tiêu chuẩn chất lượng của GEM - Đảm bảo uy tín và chất lượng sản phẩm",
};

export default function CertificationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Kiểm định</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Tiêu chuẩn kiểm định của GEM</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Tại GEM, chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng cao, 
            được kiểm định nghiêm ngặt theo các tiêu chuẩn quốc tế. Mỗi sản phẩm đều trải qua 
            quy trình kiểm định toàn diện trước khi đến tay khách hàng.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Kiểm định đá quý</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Xác định nguồn gốc đá quý</li>
                <li>Kiểm tra độ tinh khiết</li>
                <li>Đánh giá màu sắc và độ trong</li>
                <li>Đo kích thước và trọng lượng</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Kiểm định kim loại</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Xác định hàm lượng kim loại quý</li>
                <li>Kiểm tra độ tinh khiết</li>
                <li>Đánh giá độ bền và độ cứng</li>
                <li>Kiểm tra lớp mạ bề mặt</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Quy trình kiểm định</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold">Kiểm tra đầu vào</h3>
                <p className="text-gray-700">Kiểm tra nguồn gốc và tính xác thực của nguyên liệu</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold">Phân tích thành phần</h3>
                <p className="text-gray-700">Sử dụng thiết bị hiện đại để phân tích chi tiết thành phần</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold">Đánh giá chất lượng</h3>
                <p className="text-gray-700">Kiểm tra các tiêu chí về độ bền, độ sáng và tính thẩm mỹ</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</div>
              <div>
                <h3 className="font-semibold">Cấp chứng nhận</h3>
                <p className="text-gray-700">Cấp giấy chứng nhận kiểm định cho sản phẩm đạt chuẩn</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Chứng nhận quốc tế</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              GEM tự hào được chứng nhận bởi các tổ chức uy tín quốc tế:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>ISO 9001:2015 - Quản lý chất lượng</li>
              <li>ISO 14001:2015 - Quản lý môi trường</li>
              <li>Chứng nhận GIA (Gemological Institute of America)</li>
              <li>Chứng nhận SGS (Société Générale de Surveillance)</li>
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Cam kết chất lượng</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              Chúng tôi cam kết:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>100% sản phẩm được kiểm định trước khi bán</li>
              <li>Bảo hành chất lượng theo tiêu chuẩn quốc tế</li>
              <li>Hoàn tiền nếu phát hiện sản phẩm không đúng chất lượng</li>
              <li>Hỗ trợ kiểm định miễn phí cho khách hàng</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
} 