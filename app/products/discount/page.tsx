import { prisma } from "@/lib/prisma";
import { Category, Collection, Product, ProductImage } from "@prisma/client";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import DiscountProductsContent from "./DiscountProductsContent";

export const metadata: Metadata = {
  title: "Sản phẩm khuyến mãi | GEM Store",
  description: "Khám phá các sản phẩm đang được khuyến mãi tại GEM Store",
};

interface InitialData {
  products: (Product & {
    images: ProductImage[];
    category: { name: string } | null;
  })[];
  categories: Category[];
  collections: Collection[];
}

async function getInitialData(): Promise<InitialData> {
  try {
  const now = new Date();
  const [products, categories, collections] = await Promise.all([
    prisma.product.findMany({
      where: {
        hasDiscount: true,
        inStock: true,
        discountStartDate: { lte: now },
        discountEndDate: { gte: now },
      },
      include: {
        images: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        discountPercentage: 'desc',
      },
      take: 12,
    }),
    prisma.category.findMany(),
    prisma.collection.findMany({
      where: {
        active: true,
      },
    }),
  ]);

  return {
    products,
    categories,
      collections,
    };
  } catch (error) {
    console.error('Error fetching discount products:', error);
    return {
      products: [],
      categories: [],
      collections: [],
    };
  }
}

export default async function DiscountProductsPage() {
  const initialData = await getInitialData();

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6 mt-10">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="list-reset flex">
            <li>
              <Link href="/" className="hover:underline text-gray-700">Trang chủ</Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li>
              <Link href="/products" className="hover:underline text-gray-700">Sản phẩm</Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li className="text-primary font-semibold">Khuyến mãi</li>
          </ol>
        </nav>
      </div>

      {/* Banner Image */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6">
        <div className="relative w-full h-[350px] mb-8">
          <Image
            src="/images/products/f92fc962-aa88-4fd8-9b9a-07ad2c49fb99.jpg"
            alt="Banner Khuyến mãi"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <Suspense fallback={
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
            </div>
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
                    <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <DiscountProductsContent initialData={initialData} />
      </Suspense>
    </>
  );
} 