import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Lấy danh sách đăng ký cộng tác
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Xây dựng điều kiện tìm kiếm
    const where: any = {};
    
    if (status && status !== 'ALL') {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Lấy tổng số bản ghi
    const total = await prisma.partnerRegistration.count({ where });

    // Lấy danh sách đăng ký
    const registrations = await prisma.partnerRegistration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json({
      registrations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching partner registrations:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy danh sách đăng ký' },
      { status: 500 }
    );
  }
}

// PATCH - Cập nhật trạng thái đăng ký
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { message: 'Thiếu thông tin cần thiết' },
        { status: 400 }
      );
    }

    const updatedRegistration = await prisma.partnerRegistration.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json({
      message: 'Cập nhật trạng thái thành công',
      registration: updatedRegistration,
    });
  } catch (error) {
    console.error('Error updating partner registration:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi cập nhật trạng thái' },
      { status: 500 }
    );
  }
} 