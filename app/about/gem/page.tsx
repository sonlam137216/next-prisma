import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Về GEM - Công ty TNHH GEM",
  description: "Tìm hiểu về GEM - Thương hiệu trang sức và vật phẩm phong thủy uy tín hàng đầu Việt Nam",
};

export default function AboutGemPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Về GEM</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Sứ mệnh của chúng tôi</h2>
          <p className="text-gray-700 leading-relaxed">
            GEM tự hào là thương hiệu trang sức và vật phẩm phong thủy uy tín hàng đầu Việt Nam. 
            Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng cao, 
            kết hợp giữa vẻ đẹp thẩm mỹ và giá trị phong thủy.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Tầm nhìn</h2>
          <p className="text-gray-700 leading-relaxed">
            Với tầm nhìn trở thành thương hiệu dẫn đầu trong lĩnh vực trang sức và vật phẩm phong thủy, 
            GEM không ngừng nỗ lực phát triển, đổi mới và mang đến những trải nghiệm tốt nhất cho khách hàng.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Giá trị cốt lõi</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Chất lượng sản phẩm vượt trội</li>
            <li>Dịch vụ khách hàng tận tâm</li>
            <li>Đổi mới và sáng tạo không ngừng</li>
            <li>Uy tín và minh bạch trong kinh doanh</li>
            <li>Bảo tồn và phát huy giá trị văn hóa truyền thống</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Lịch sử phát triển</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">2010</h3>
              <p className="text-gray-700">Thành lập GEM với cửa hàng đầu tiên tại Hà Nội</p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">2015</h3>
              <p className="text-gray-700">Mở rộng thị trường với chuỗi cửa hàng tại các thành phố lớn</p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">2020</h3>
              <p className="text-gray-700">Phát triển mạnh mẽ trong lĩnh vực thương mại điện tử</p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">2023</h3>
              <p className="text-gray-700">Trở thành thương hiệu dẫn đầu trong lĩnh vực trang sức và vật phẩm phong thủy</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 