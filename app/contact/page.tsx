import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-[1400px] mx-auto py-12 px-4 md:px-6">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">Liên Hệ Với Chúng Tôi</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh sau:
        </p>
        <Separator className="my-8" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Thông Tin Liên Hệ</CardTitle>
              <CardDescription>Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Địa Chỉ</h3>
                  <p className="text-muted-foreground">
                    SH1-08 Khu Đô Thị Sala, 153 Nguyễn Cơ Thạch,<br />
                    Phường An Lợi Đông, TP. Thủ Đức,<br />
                    TP. Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Điện Thoại</h3>
                  <p className="text-muted-foreground">
                    Hotline: 19006081<br />
                    Điện thoại: 028 73006061
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">cskh@matviet.vn</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Giờ Làm Việc</h3>
                  <p className="text-muted-foreground">
                    Thứ 2 - Thứ 6: 8:00 - 20:00<br />
                    Thứ 7 - Chủ Nhật: 9:00 - 18:00
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Section */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Bản Đồ</CardTitle>
              <CardDescription>Vị trí cửa hàng của chúng tôi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.231914983251!2d106.7292!3d10.8017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ4JzA2LjEiTiAxMDbCsDQzJzQ1LjEiRQ!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Gửi Tin Nhắn Cho Chúng Tôi</CardTitle>
            <CardDescription>
              Điền thông tin vào form bên dưới và chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Họ và tên
                  </label>
                  <Input id="name" placeholder="Nhập họ và tên của bạn" className="h-12" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Nhập email của bạn" className="h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Số điện thoại
                </label>
                <Input id="phone" type="tel" placeholder="Nhập số điện thoại của bạn" className="h-12" />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Chủ đề
                </label>
                <Input id="subject" placeholder="Nhập chủ đề liên hệ" className="h-12" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Nội dung
                </label>
                <Textarea
                  id="message"
                  placeholder="Nhập nội dung tin nhắn của bạn"
                  className="min-h-[150px]"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-base">
                Gửi Tin Nhắn
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 