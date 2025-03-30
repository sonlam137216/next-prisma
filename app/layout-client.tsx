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
        <div className="w-full fixed top-0 left-0 right-0 bg-white shadow-md z-50">
          <div className="max-w-screen-xl mx-auto w-full">
            <Header />
          </div>
        </div>
      )}
      <main className={`flex-1 p-4 ${!isAdminRoute ? 'pt-20' : ''}`}>
        <div className="mx-auto w-full">
          {children}
        </div>
      </main>
    </>
  );
}