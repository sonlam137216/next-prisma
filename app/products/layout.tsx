import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products | GEM Store',
  description: 'Browse our collection of high-quality products. Find the best deals on various categories including electronics, fashion, and more.',
  keywords: 'products, online store, shopping, deals, categories',
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 