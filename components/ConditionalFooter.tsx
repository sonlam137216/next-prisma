"use client";
import { Footer } from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="w-full px-0 bg-background shadow-inner">
      <Footer />
    </footer>
  );
} 