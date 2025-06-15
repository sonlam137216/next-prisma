import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sản phẩm khuyến mãi | GEM Store",
  description: "Khám phá các sản phẩm đang được khuyến mãi tại GEM Store",
};

export default function DiscountProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 