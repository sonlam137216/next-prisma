"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { JSX, SVGProps, useState, useEffect } from "react";
import { useDashboardStore } from "@/app/store/dashboardStore";
import CartSidebar from "./CartSidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBlogStore } from "@/app/store/blogStore";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const { cart, toggleCart, categories, fetchCategories } = useDashboardStore();
  const { categories: blogCategories } = useBlogStore();
  const router = useRouter();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add animation styles
  useEffect(() => {
    // Add the animation style to the global stylesheet
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-in-out;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories();
      setIsLoading(false);
    };

    loadCategories();
  }, [fetchCategories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="w-full sticky top-0 bg-primary z-40 shadow-md">
      <div className="w-full px-4 md:px-8 lg:px-12 relative">
        {/* Upper Header: Logo, Search, Cart */}
        <div className="flex h-16 sm:h-20 w-full items-center justify-between z-10 relative">
          {/* Mobile Menu Button - Only visible on mobile */}
          <div className="lg:hidden z-20">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-primary">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Mở menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-[#B65001] text-white">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <div className="grid gap-2 py-4 mt-8">
                  <h3 className="text-sm font-medium">Danh mục</h3>
                  {!isLoading &&
                    categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.id}`}
                        className="flex w-full items-center py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        {category.name}
                      </Link>
                    ))}
                  <div className="h-px bg-white/30 my-3" />
                  <Link
                    href="/products"
                    className="flex w-full items-center py-2 text-sm font-medium hover:text-primary transition-colors"
                    prefetch={false}
                  >
                    Trang sức
                  </Link>
                  <Link
                    href="/products"
                    className="flex w-full items-center py-2 text-sm font-medium hover:text-primary transition-colors"
                    prefetch={false}
                  >
                    Sản phẩm phong thủy
                  </Link>
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium">Tin tức</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                    <div className="pl-4 space-y-2">
                      <Link
                        href="/blog"
                        className="flex w-full items-center py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Tất cả
                      </Link>
                      {blogCategories.map((category) => (
                        <Link
                          key={category}
                          href={`/blog?category=${encodeURIComponent(category)}`}
                          className="flex w-full items-center py-2 text-sm hover:text-primary transition-colors"
                          prefetch={false}
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="flex w-full items-center py-2 text-sm font-medium hover:text-primary transition-colors"
                    prefetch={false}
                  >
                    Liên hệ
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo - Now only in the upper header */}
          <div className="flex items-center">
            <Link href="/" prefetch={false}>
              <Image
                src="/logo/qLbMRkWw.jpg"
                width={300}
                height={120}
                alt="Logo"
                className="h-auto w-36 sm:w-44 md:w-48 lg:w-56"
                priority
              />
            </Link>
          </div>

          {/* Desktop Search Input */}
          <div className="hidden md:flex justify-center max-w-xl w-full mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 pr-4 py-3 w-full border border-white/30 rounded-full focus:ring-2 focus:ring-white focus:border-white bg-white text-primary placeholder:text-primary/90"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Mobile Search Toggle Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Tìm kiếm"
              className="text-white hover:text-primary"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Giỏ hàng"
              className="relative p-1 text-white hover:text-primary"
              onClick={toggleCart}
            >
              <ShoppingBagIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-white text-[#B65001]">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search - Expandable */}
        {isSearchOpen && (
          <div className="md:hidden py-3 px-2 border-t border-white/20 animate-fadeIn bg-[#B65001]">
            <form onSubmit={handleSearch} className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/80" />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 pr-4 py-2 w-full border border-white/30 rounded-full focus:ring-2 focus:ring-primary-foreground focus:border-primary-foreground bg-[#B65001] text-white placeholder:text-white/70"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        )}

        {/* Navigation Menu - Full width, colored, and text updated for contrast */}
        <div className="border-t border-white/20 bg-primary py-1 w-full">
          <div className="h-12 flex items-center w-full">
            <NavigationMenu className="hidden lg:flex z-20 w-full" viewport={false}>
              <NavigationMenuList className="flex items-center gap-8 w-full">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-white hover:text-primary bg-transparent hover:bg-[#B65001]/90">
                    Giới thiệu
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col p-4 w-48 rounded-md shadow-md bg-white">
                      <Link
                        href="/about/gia-tri"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Giá trị
                      </Link>
                      <Link
                        href="/about/chat-luong"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Chất lượng
                      </Link>
                      <Link
                        href="/about/lich-su"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Lịch sử
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/products"
                    className="group inline-flex h-12 items-center justify-center px-4 text-sm font-medium text-white transition-colors hover:text-primary focus:text-primary-foreground focus:outline-none"
                    prefetch={false}
                  >
                    Trang sức
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/products"
                    className="group inline-flex h-12 items-center justify-center px-4 text-sm font-medium text-white transition-colors hover:text-primary focus:text-primary-foreground focus:outline-none"
                    prefetch={false}
                  >
                    Sản phẩm phong thủy
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-white hover:text-primary bg-transparent hover:bg-[#B65001]/90">
                    Tin tức
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col p-4 w-48 rounded-md shadow-md bg-white">
                      <Link
                        href="/blog"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Tất cả
                      </Link>
                      {blogCategories.map((category) => (
                        <Link
                          key={category}
                          href={`/blog?category=${encodeURIComponent(category)}`}
                          className="py-2 text-sm hover:text-primary transition-colors"
                          prefetch={false}
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/contact"
                    className="group inline-flex h-12 items-center justify-center px-4 text-sm font-medium text-white transition-colors hover:text-primary focus:text-primary focus:outline-none"
                    prefetch={false}
                  >
                    Liên hệ
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/contact"
                    className="group inline-flex h-12 items-center justify-center px-4 text-sm font-medium text-white transition-colors hover:text-primary focus:text-primary focus:outline-none"
                    prefetch={false}
                  >
                    ƯU ĐÃI ĐỘC QUYỀN CHO KHÁCH HÀNG MỚI - xem chi tiết
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function ShoppingBagIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
