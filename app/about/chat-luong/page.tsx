"use client";

import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import Image from "next/image";

export default function QualityPage() {
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
            Cam Kết Chất Lượng
          </h1>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Quy Trình Kiểm Định</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Mỗi sản phẩm của chúng tôi đều trải qua quy trình kiểm định nghiêm ngặt với nhiều bước:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Kiểm tra nguồn gốc nguyên liệu</li>
                <li>Đánh giá độ tinh khiết</li>
                <li>Kiểm định chất lượng chế tác</li>
                <li>Đảm bảo độ bền và tuổi thọ sản phẩm</li>
                <li>Kiểm tra an toàn cho người sử dụng</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Tiêu Chuẩn Quốc Tế</h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi tuân thủ nghiêm ngặt các tiêu chuẩn quốc tế trong ngành trang sức và phong thủy. 
                Tất cả sản phẩm đều được chứng nhận bởi các tổ chức uy tín, đảm bảo tính minh bạch và 
                độ tin cậy cho khách hàng.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Bảo Hành & Dịch Vụ Hậu Mãi</h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi cam kết bảo hành dài hạn cho tất cả sản phẩm, cùng với dịch vụ chăm sóc và 
                bảo trì định kỳ. Đội ngũ kỹ thuật viên chuyên nghiệp của chúng tôi luôn sẵn sàng hỗ trợ 
                khách hàng mọi lúc, mọi nơi.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Đổi Trả & Hoàn Tiền</h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi áp dụng chính sách đổi trả và hoàn tiền linh hoạt trong vòng 30 ngày kể từ 
                ngày mua hàng. Khách hàng có thể hoàn toàn yên tâm khi lựa chọn sản phẩm của chúng tôi.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
} 