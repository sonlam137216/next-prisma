import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tuyển dụng - GEM",
  description: "Cơ hội nghề nghiệp tại GEM - Tham gia vào đội ngũ chuyên nghiệp của thương hiệu trang sức và vật phẩm phong thủy hàng đầu",
};

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Tuyển dụng</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Tại sao chọn GEM?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Môi trường làm việc</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Môi trường làm việc chuyên nghiệp, năng động</li>
                <li>Cơ hội phát triển bản thân không ngừng</li>
                <li>Được làm việc với đội ngũ chuyên gia hàng đầu</li>
                <li>Không gian làm việc hiện đại, tiện nghi</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Chế độ đãi ngộ</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Mức lương cạnh tranh theo năng lực</li>
                <li>Bảo hiểm sức khỏe cao cấp</li>
                <li>Chế độ nghỉ phép linh hoạt</li>
                <li>Đào tạo và phát triển chuyên môn</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Vị trí đang tuyển</h2>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">Chuyên viên tư vấn phong thủy</h3>
              <p className="text-gray-700 mb-2">Số lượng: 2 người</p>
              <div className="space-y-2">
                <h4 className="font-medium">Yêu cầu:</h4>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Tốt nghiệp chuyên ngành liên quan đến phong thủy</li>
                  <li>Kinh nghiệm tư vấn phong thủy từ 2 năm</li>
                  <li>Kỹ năng giao tiếp và thuyết trình tốt</li>
                  <li>Đam mê với lĩnh vực trang sức và phong thủy</li>
                </ul>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">Thiết kế trang sức</h3>
              <p className="text-gray-700 mb-2">Số lượng: 1 người</p>
              <div className="space-y-2">
                <h4 className="font-medium">Yêu cầu:</h4>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Tốt nghiệp chuyên ngành thiết kế trang sức</li>
                  <li>Thành thạo các phần mềm thiết kế 3D</li>
                  <li>Kinh nghiệm thiết kế trang sức từ 3 năm</li>
                  <li>Khả năng sáng tạo và đổi mới</li>
                </ul>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">Nhân viên kinh doanh</h3>
              <p className="text-gray-700 mb-2">Số lượng: 3 người</p>
              <div className="space-y-2">
                <h4 className="font-medium">Yêu cầu:</h4>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Tốt nghiệp đại học các chuyên ngành kinh tế</li>
                  <li>Kinh nghiệm bán hàng từ 1 năm</li>
                  <li>Kỹ năng giao tiếp và thuyết phục tốt</li>
                  <li>Đam mê với lĩnh vực trang sức</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Quy trình tuyển dụng</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold">Nộp hồ sơ</h3>
                <p className="text-gray-700">Gửi CV và thư giới thiệu qua email</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold">Phỏng vấn sơ bộ</h3>
                <p className="text-gray-700">Phỏng vấn qua điện thoại hoặc video call</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold">Phỏng vấn trực tiếp</h3>
                <p className="text-gray-700">Phỏng vấn với quản lý trực tiếp và HR</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</div>
              <div>
                <h3 className="font-semibold">Thử việc</h3>
                <p className="text-gray-700">Thử việc 1-2 tháng tùy vị trí</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Nộp hồ sơ</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              Gửi hồ sơ của bạn đến:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Email: careers@gem.com</li>
              <li>Địa chỉ: [Địa chỉ công ty]</li>
              <li>Điện thoại: 1900 xxxx</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Hồ sơ bao gồm:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>CV chi tiết</li>
              <li>Thư giới thiệu</li>
              <li>Bằng cấp và chứng chỉ liên quan</li>
              <li>Portfolio (nếu có)</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
} 