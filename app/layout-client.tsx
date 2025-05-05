'use client';

import Header from "@/components/Header";
import { usePathname } from "next/navigation";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && (
        <div className="w-full fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>
      )}
      <main className={`flex-1 ${!isAdminRoute ? 'pt-20' : ''}`}>
        {children}
      </main>
    </>
  );
}