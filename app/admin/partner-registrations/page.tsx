"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Eye, CheckCircle, XCircle, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface PartnerRegistration {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  businessType: string;
  address: string;
  city: string;
  experience?: string;
  expectedRevenue?: string;
  message?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONTACTED';
  createdAt: string;
  updatedAt: string;
}

const statusLabels = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Từ chối', color: 'bg-red-100 text-red-800' },
  CONTACTED: { label: 'Đã liên hệ', color: 'bg-blue-100 text-blue-800' },
};

const businessTypeLabels = {
  retail: 'Bán lẻ (Shop/Cửa hàng)',
  wholesale: 'Bán sỉ',
  online: 'Kinh doanh online',
  distributor: 'Đại lý phân phối',
  other: 'Khác',
};

export default function PartnerRegistrationsPage() {
  const [registrations, setRegistrations] = useState<PartnerRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedRegistration, setSelectedRegistration] = useState<PartnerRegistration | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchQuery,
        status: statusFilter,
      });

      const response = await fetch(`/api/admin/partner-registrations?${params}`);
      const data = await response.json();

      if (response.ok) {
        setRegistrations(data.registrations);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [searchQuery, statusFilter, pagination.page]);

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch("/api/admin/partner-registrations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        fetchRegistrations();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý đăng ký cộng tác</h1>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
                <SelectItem value="CONTACTED">Đã liên hệ</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Tìm kiếm</Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đăng ký ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thông tin</TableHead>
                    <TableHead>Loại hình KD</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày đăng ký</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{registration.fullName}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {registration.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {registration.phone}
                          </div>
                          {registration.companyName && (
                            <div className="text-sm text-gray-500">
                              {registration.companyName}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {businessTypeLabels[registration.businessType as keyof typeof businessTypeLabels] || registration.businessType}
                        </div>
                        {registration.expectedRevenue && (
                          <div className="text-xs text-gray-500 mt-1">
                            {registration.expectedRevenue}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{registration.address}</div>
                          <div className="text-gray-500">{registration.city}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusLabels[registration.status].color}>
                          {statusLabels[registration.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(registration.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRegistration(registration)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Chi tiết đăng ký</DialogTitle>
                                <DialogDescription>
                                  Thông tin chi tiết của đăng ký cộng tác
                                </DialogDescription>
                              </DialogHeader>
                              {selectedRegistration && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="font-medium">Họ và tên:</label>
                                      <p>{selectedRegistration.fullName}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Email:</label>
                                      <p>{selectedRegistration.email}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Số điện thoại:</label>
                                      <p>{selectedRegistration.phone}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Công ty/Shop:</label>
                                      <p>{selectedRegistration.companyName || 'Không có'}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Loại hình kinh doanh:</label>
                                      <p>{businessTypeLabels[selectedRegistration.businessType as keyof typeof businessTypeLabels] || selectedRegistration.businessType}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Doanh thu mong đợi:</label>
                                      <p>{selectedRegistration.expectedRevenue || 'Không có'}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="font-medium">Địa chỉ:</label>
                                    <p>{selectedRegistration.address}, {selectedRegistration.city}</p>
                                  </div>
                                  {selectedRegistration.experience && (
                                    <div>
                                      <label className="font-medium">Kinh nghiệm kinh doanh:</label>
                                      <p>{selectedRegistration.experience}</p>
                                    </div>
                                  )}
                                  {selectedRegistration.message && (
                                    <div>
                                      <label className="font-medium">Tin nhắn bổ sung:</label>
                                      <p>{selectedRegistration.message}</p>
                                    </div>
                                  )}
                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      onClick={() => updateStatus(selectedRegistration.id, 'APPROVED')}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Duyệt
                                    </Button>
                                    <Button
                                      onClick={() => updateStatus(selectedRegistration.id, 'REJECTED')}
                                      variant="destructive"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Từ chối
                                    </Button>
                                    <Button
                                      onClick={() => updateStatus(selectedRegistration.id, 'CONTACTED')}
                                      variant="outline"
                                    >
                                      <Phone className="h-4 w-4 mr-2" />
                                      Đã liên hệ
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-500">
                    Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} bản ghi
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 