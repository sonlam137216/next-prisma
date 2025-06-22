import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      fullName,
      email,
      phone,
      companyName,
      businessType,
      address,
      city,
      experience,
      expectedRevenue,
      message
    } = data;

    if (!fullName || !email || !phone || !businessType || !address || !city) {
      return NextResponse.json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc.' }, { status: 400 });
    }

    const registration = await prisma.partnerRegistration.create({
      data: {
        fullName,
        email,
        phone,
        companyName,
        businessType,
        address,
        city,
        experience,
        expectedRevenue,
        message,
      },
    });

    return NextResponse.json({ message: 'Đăng ký thành công', registration });
  } catch (error) {
    console.error("Error saving partner registration:", error);
    return NextResponse.json({ message: 'Có lỗi xảy ra khi lưu thông tin.' }, { status: 500 });
  }
} 