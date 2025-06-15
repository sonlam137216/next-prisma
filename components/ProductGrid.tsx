import { ReactNode } from "react";

interface ProductGridProps {
  children: ReactNode;
}

export default function ProductGrid({ children }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {children}
    </div>
  );
} 