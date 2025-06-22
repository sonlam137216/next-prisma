"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PartnerRegistrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    businessType: '',
    address: '',
    city: '',
    experience: '',
    expectedRevenue: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/partner-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          companyName: '',
          businessType: '',
          address: '',
          city: '',
          experience: '',
          expectedRevenue: '',
          message: ''
        });
      } else {
        const error = await response.json();
        setSubmitStatus('error');
        setErrorMessage(error.message || 'Có lỗi xảy ra khi gửi đăng ký');
      }
    } catch (error) {
      console.error("Error saving partner registration:", error);
      setSubmitStatus('error');
      setErrorMessage('Có lỗi xảy ra khi kết nối với máy chủ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Đăng Ký Cộng Tác Kinh Doanh
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trở thành đối tác của GEM và cùng phát triển kinh doanh trang sức phong thủy
          </p>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Đăng ký của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Thông Tin Đăng Ký</CardTitle>
            <CardDescription className="text-center">
              Vui lòng điền đầy đủ thông tin bên dưới để chúng tôi có thể hỗ trợ bạn tốt nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Thông Tin Cá Nhân
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Nhập họ và tên đầy đủ"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="0123456789"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Tên công ty/Shop</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Tên công ty hoặc shop của bạn"
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Thông Tin Kinh Doanh
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Loại hình kinh doanh *</Label>
                    <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại hình kinh doanh" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Bán lẻ (Shop/Cửa hàng)</SelectItem>
                        <SelectItem value="wholesale">Bán sỉ</SelectItem>
                        <SelectItem value="online">Kinh doanh online</SelectItem>
                        <SelectItem value="distributor">Đại lý phân phối</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expectedRevenue">Doanh thu mong đợi</Label>
                    <Select value={formData.expectedRevenue} onValueChange={(value) => handleInputChange('expectedRevenue', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mức doanh thu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-100m">Dưới 100 triệu/năm</SelectItem>
                        <SelectItem value="100m-500m">100 - 500 triệu/năm</SelectItem>
                        <SelectItem value="500m-1b">500 triệu - 1 tỷ/năm</SelectItem>
                        <SelectItem value="over-1b">Trên 1 tỷ/năm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Kinh nghiệm kinh doanh</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Mô tả kinh nghiệm kinh doanh của bạn (nếu có)"
                    rows={3}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Địa Chỉ
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Số nhà, đường, phường/xã"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Tỉnh/Thành phố"
                    required
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Thông Tin Bổ Sung
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Tin nhắn bổ sung</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Bạn có thể chia sẻ thêm về mục tiêu kinh doanh, kế hoạch phát triển hoặc bất kỳ thông tin nào khác..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi Đăng Ký"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/about/wholesale')}
                  className="flex-1"
                >
                  Quay Lại
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="font-semibold mb-2">Chính Sách Giá Ưu Đãi</h3>
            <p className="text-gray-600 text-sm">
              Hưởng mức giá sỉ đặc biệt cạnh tranh, giúp tối ưu hóa lợi nhuận
            </p>
          </Card>
          
          <Card className="text-center p-6">
            <div className="text-3xl mb-4">📈</div>
            <h3 className="font-semibold mb-2">Hỗ Trợ Marketing</h3>
            <p className="text-gray-600 text-sm">
              Cung cấp hình ảnh, video sản phẩm chuyên nghiệp và nội dung quảng cáo
            </p>
          </Card>
          
          <Card className="text-center p-6">
            <div className="text-3xl mb-4">🎓</div>
            <h3 className="font-semibold mb-2">Đào Tạo Chuyên Sâu</h3>
            <p className="text-gray-600 text-sm">
              Tham gia các khóa đào tạo về kiến thức sản phẩm và kỹ năng bán hàng
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
} 