"use client";

import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";

export default function ValuesPage() {
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
            Giá Trị Cốt Lõi
          </h1>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Chất Lượng Tuyệt Đối</h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi cam kết mang đến những sản phẩm trang sức và phong thủy chất lượng cao nhất, 
                được chọn lọc kỹ lưỡng từ những nguyên liệu quý giá. Mỗi sản phẩm đều được kiểm định 
                nghiêm ngặt để đảm bảo độ tinh khiết và giá trị thực.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Sự Tận Tâm</h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi luôn đặt khách hàng làm trung tâm, lắng nghe và thấu hiểu nhu cầu của từng 
                người. Đội ngũ tư vấn chuyên nghiệp của chúng tôi luôn sẵn sàng hỗ trợ và đồng hành 
                cùng bạn trong việc lựa chọn những sản phẩm phù hợp nhất.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Sáng Tạo Không Ngừng</h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi không ngừng sáng tạo và cập nhật những xu hướng mới nhất trong ngành trang sức 
                và phong thủy. Mỗi thiết kế đều mang dấu ấn riêng, kết hợp hài hòa giữa truyền thống và 
                hiện đại.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Trách Nhiệm Xã Hội</h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi cam kết thực hiện trách nhiệm xã hội thông qua việc sử dụng nguồn nguyên liệu 
                có nguồn gốc rõ ràng, đảm bảo quyền lợi của người lao động và góp phần vào sự phát triển 
                bền vững của cộng đồng.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
} 