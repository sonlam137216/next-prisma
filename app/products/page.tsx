// app/products/page.tsx
import { Category, ExtendedProduct } from '@/app/store/dashboardStore';
import { Collection } from '@/app/store/collectionStore';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import ProductsContent from './ProductsContent';

export const metadata: Metadata = {
  title: 'Products | GEM Store',
  description: 'Browse our collection of high-quality products. Find the best deals on various categories including electronics, fashion, and more.',
  keywords: 'products, online store, shopping, deals, categories',
  openGraph: {
    title: 'Products | Your Store Name',
    description: 'Browse our collection of high-quality products. Find the best deals on various categories.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Your Store Name',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products | Your Store Name',
    description: 'Browse our collection of high-quality products. Find the best deals on various categories.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

interface InitialData {
  products: ExtendedProduct[];
  categories: Category[];
  collections: Collection[];
}

async function getInitialData(): Promise<InitialData> {
  try {
    const [products, categories, collections] = await Promise.all([
      prisma.product.findMany({
        take: 12,
        include: {
          category: true,
          images: true,
          collections: true,
          stoneSizes: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.category.findMany({ select: true }),
      prisma.collection.findMany(),
    ]);

    // Product: format dates appropriately
    const formattedProducts: ExtendedProduct[] = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      discountPrice: product.discountPrice,
      discountPercentage: product.discountPercentage,
      discountStartDate: product.discountStartDate?.toISOString() || null,
      discountEndDate: product.discountEndDate?.toISOString() || null,
      hasDiscount: product.hasDiscount,
      quantity: product.quantity,
      inStock: product.inStock,
      type: product.type,
      line: product.line,
      categoryId: product.categoryId,
      createdAt: product.createdAt.toISOString(),
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        description: product.category.description,
        createdAt: product.category.createdAt.toISOString(),
      } : undefined,
      images: product.images.map(image => ({
        id: image.id,
        url: image.url,
        isMain: image.isMain,
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toISOString(),
        productId: image.productId,
      })),
      collections: product.collections.map(collection => ({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        imageUrl: collection.imageUrl,
        active: collection.active,
        createdAt: collection.createdAt.toISOString(),
        updatedAt: collection.updatedAt.toISOString(),
      })),
      stoneSizes: product.stoneSizes,
    }));

    // Category: createdAt as string
    const formattedCategories: Category[] = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      createdAt: category.createdAt.toISOString(),
    }));

    // Collection: createdAt/updatedAt as string
    const formattedCollections: Collection[] = collections.map(collection => ({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      imageUrl: collection.imageUrl,
      active: collection.active,
      createdAt: collection.createdAt.toISOString(),
      updatedAt: collection.updatedAt.toISOString(),
    }));

    return {
      products: formattedProducts,
      categories: formattedCategories,
      collections: formattedCollections,
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      products: [],
      categories: [],
      collections: [],
    };
  }
}

export default async function ProductsPage() {
  const initialData = await getInitialData();

  return (
    <>
      {/* Breadcrumb (now above banner) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 mt-10">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="list-reset flex">
            <li>
              <Link href="/" className="hover:underline text-gray-700">Trang chủ</Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li className="text-primary font-semibold">Sản phẩm</li>
          </ol>
        </nav>
      </div>
      {/* Banner Image (below breadcrumb) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6">
        <div className="relative w-full h-[350px] mb-8">
          <Image
            src="/images/products/f92fc962-aa88-4fd8-9b9a-07ad2c49fb99.jpg"
            alt="Banner Sản phẩm"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      <Suspense fallback={
        <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 py-8">
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
        <ProductsContent initialData={initialData} />
      </Suspense>
    </>
  );
}