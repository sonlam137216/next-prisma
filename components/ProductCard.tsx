import { formatPrice } from "@/lib/utils";
import { Product, ProductImage } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";

interface ProductCardProps {
  product: Product & {
    images: ProductImage[];
    category: { name: string };
  };
  showDiscount?: boolean;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images.find((img) => img.isMain) || product.images[0];
  const isDiscounted = product.hasDiscount && 
    product.discountStartDate && 
    product.discountEndDate &&
    new Date() >= new Date(product.discountStartDate) &&
    new Date() <= new Date(product.discountEndDate);

  const displayPrice = isDiscounted && product.discountPrice 
    ? product.discountPrice 
    : product.price;

  return (
    <Link 
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-white transition-all hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden">
        {mainImage && (
          <Image
            src={mainImage.url}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 33vw"
          />
        )}
        {isDiscounted && (
          <Badge 
            className="absolute top-2 right-2 bg-red-500 text-white"
            variant="destructive"
          >
            -{product.discountPercentage}%
          </Badge>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 text-sm font-medium text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <div className="flex items-center gap-2">
            <span className={`text-lg font-semibold ${isDiscounted ? 'text-red-500' : 'text-primary'}`}>
              {formatPrice(displayPrice)}
            </span>
            {isDiscounted && product.price > displayPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          <p className="mt-1 text-sm text-gray-500">
            {product.category.name}
          </p>
        </div>
      </div>
    </Link>
  );
} 