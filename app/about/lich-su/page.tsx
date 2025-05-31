"use client";

import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";

export default function HistoryPage() {
  return (
    <Container>
      <div className="py-12 md:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
            Lịch Sử Phát Triển
          </h1>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Khởi Nguồn</h2>
              <p className="text-gray-600 leading-relaxed">
                Được thành lập vào năm 2010, GEM Store bắt đầu với một cửa hàng nhỏ tại trung tâm thành phố. 
                Với tình yêu và đam mê dành cho ngành trang sức và phong thủy, chúng tôi đã không ngừng 
                phát triển và mở rộng quy mô hoạt động.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Những Cột Mốc Quan Trọng</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-lg">2010</h3>
                  <p className="text-gray-600">Thành lập cửa hàng đầu tiên</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-lg">2015</h3>
                  <p className="text-gray-600">Mở rộng chuỗi cửa hàng trên toàn quốc</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-lg">2018</h3>
                  <p className="text-gray-600">Phát triển hệ thống bán hàng trực tuyến</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-lg">2020</h3>
                  <p className="text-gray-600">Đạt chứng nhận ISO về chất lượng sản phẩm</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-lg">2023</h3>
                  <p className="text-gray-600">Mở rộng thị trường quốc tế</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Tầm Nhìn Tương Lai</h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi không ngừng phấn đấu để trở thành thương hiệu hàng đầu trong lĩnh vực trang sức 
                và phong thủy. Với định hướng phát triển bền vững, chúng tôi cam kết mang đến những sản phẩm 
                chất lượng cao nhất, đồng thời góp phần vào sự phát triển của cộng đồng và bảo vệ môi trường.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Đội Ngũ Chuyên Gia</h2>
              <p className="text-gray-600 leading-relaxed">
                Với đội ngũ chuyên gia giàu kinh nghiệm trong lĩnh vực trang sức và phong thủy, chúng tôi 
                tự hào mang đến cho khách hàng những sản phẩm và dịch vụ tốt nhất. Mỗi thành viên trong 
                đội ngũ đều được đào tạo chuyên sâu và không ngừng cập nhật kiến thức để phục vụ khách hàng 
                một cách tốt nhất.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
} 