// pages/about.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AwardIcon, GemIcon, HeartIcon, ShieldIcon } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">Về Chúng Tôi</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Hành trình khám phá và lan tỏa năng lượng tích cực từ những viên đá phong thủy quý giá
        </p>
        <Separator className="my-8" />
      </div>
      
      {/* Introduction */}
      <div className="flex flex-col md:flex-row gap-12 mb-16 items-center">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold mb-6">Câu Chuyện Của Chúng Tôi</h2>
          <p className="mb-4 text-muted-foreground">
            Thành lập vào năm 2015, chúng tôi bắt đầu từ một cửa hàng nhỏ với niềm đam mê lớn về đá phong thủy và mong muốn mang đến những sản phẩm chất lượng cao nhất đến với khách hàng.
          </p>
          <p className="mb-4 text-muted-foreground">
            Qua nhiều năm phát triển, chúng tôi đã trở thành một trong những đơn vị cung cấp đá phong thủy uy tín hàng đầu tại Việt Nam, với đa dạng sản phẩm từ các loại đá thô đến các sản phẩm tinh xảo được chế tác theo yêu cầu.
          </p>
          <p className="text-muted-foreground">
            Mỗi sản phẩm đều được chúng tôi tuyển chọn và kiểm định kỹ lưỡng để đảm bảo chất lượng và năng lượng tốt nhất đến tay khách hàng.
          </p>
        </div>
        <div className="md:w-1/2 bg-muted rounded-lg overflow-hidden">
          <div className="bg-slate-200 h-64 flex items-center justify-center">
            <Image 
              src="/api/placeholder/600/400" 
              alt="Cửa hàng đá phong thủy" 
              width={600}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
      
      {/* Core Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-10">Giá Trị Cốt Lõi</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <GemIcon className="h-10 w-10 text-primary" />,
              title: "Chất Lượng",
              description: "Cam kết cung cấp đá phong thủy thật 100%, có nguồn gốc rõ ràng và được kiểm định kỹ lưỡng."
            },
            {
              icon: <HeartIcon className="h-10 w-10 text-primary" />,
              title: "Tâm Huyết",
              description: "Xây dựng từng sản phẩm với niềm đam mê và hiểu biết sâu sắc về đá phong thủy."
            },
            {
              icon: <ShieldIcon className="h-10 w-10 text-primary" />,
              title: "Uy Tín",
              description: "Xây dựng mối quan hệ dựa trên sự tin tưởng và trung thực với khách hàng."
            },
            {
              icon: <AwardIcon className="h-10 w-10 text-primary" />,
              title: "Chuyên Môn",
              description: "Đội ngũ chuyên gia với kinh nghiệm lâu năm trong lĩnh vực đá phong thủy."
            }
          ].map((value, index) => (
            <Card key={index} className="flex flex-col items-center text-center p-6">
              <CardHeader className="pb-2">
                {value.icon}
                <CardTitle className="mt-4">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Our Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-10">Đội Ngũ Của Chúng Tôi</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Nguyễn Văn A",
              role: "Người sáng lập & CEO",
              bio: "Với hơn 15 năm kinh nghiệm trong lĩnh vực đá phong thủy, anh A đã xây dựng công ty từ những ngày đầu tiên.",
              image: "/api/placeholder/300/300"
            },
            {
              name: "Trần Thị B",
              role: "Chuyên gia phong thủy",
              bio: "Chuyên gia hàng đầu về phong thủy với chứng nhận quốc tế và hơn 10 năm tư vấn cho các khách hàng.",
              image: "/api/placeholder/300/300"
            },
            {
              name: "Lê Văn C",
              role: "Giám đốc sản phẩm",
              bio: "Người đứng sau việc tuyển chọn và kiểm định chất lượng cho tất cả sản phẩm của chúng tôi.",
              image: "/api/placeholder/300/300"
            }
          ].map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-48 bg-muted flex items-center justify-center">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  width={300}
                  height={300}
                  className="h-full w-full object-cover" 
                />
              </div>
              <CardHeader>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Story & Mission */}
      <div className="bg-muted p-8 rounded-lg mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Sứ Mệnh Của Chúng Tôi</h2>
          <p className="text-lg mb-6">
            Chúng tôi không chỉ đơn thuần là người bán đá phong thủy, mà còn là người kết nối năng lượng tích cực từ thiên nhiên đến với cuộc sống của bạn.
          </p>
          <p className="text-lg mb-8">
            Mỗi viên đá là một món quà từ thiên nhiên, và chúng tôi cam kết mang đến những món quà đó một cách trọn vẹn nhất, giúp bạn cân bằng năng lượng và tìm thấy sự bình an trong cuộc sống hiện đại.
          </p>
          <Button size="lg">Khám Phá Sản Phẩm</Button>
        </div>
      </div>
      
      {/* Testimonial */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-10">Khách Hàng Nói Gì Về Chúng Tôi</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Phạm Thị D",
              review: "Tôi đã mua rất nhiều đá phong thủy từ nhiều nơi, nhưng chưa từng hài lòng như khi mua ở đây. Sản phẩm chất lượng, dịch vụ tư vấn tận tâm.",
              rating: 5
            },
            {
              name: "Hoàng Văn E",
              review: "Đội ngũ tư vấn rất chuyên nghiệp, giúp tôi chọn được viên đá phù hợp với bản mệnh. Sau khi đeo, tôi cảm thấy năng lượng tích cực hơn hẳn.",
              rating: 5
            },
            {
              name: "Ngô Thị F",
              review: "Mua hàng online nhưng chất lượng đá và dịch vụ đều rất tốt. Đặc biệt là đội ngũ hỗ trợ sau bán hàng rất nhiệt tình.",
              rating: 4
            }
          ].map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {Array(testimonial.rating).fill(0).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <CardTitle>{testimonial.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">&ldquo;{testimonial.review}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Contact CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-6">Kết Nối Với Chúng Tôi</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Bạn có câu hỏi về đá phong thủy hoặc cần tư vấn? Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="default" size="lg">Liên Hệ Ngay</Button>
          <Button variant="outline" size="lg">Xem Sản Phẩm</Button>
        </div>
      </div>
    </div>
  );
}