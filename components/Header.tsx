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
import { useState, useEffect } from "react";
import { useDashboardStore } from "@/app/store/dashboardStore";
import CartSidebar from "./CartSidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBlogStore } from "@/app/store/blogStore";
import { ChevronDown } from "lucide-react";
import React from "react";

export default function Header() {
  const { cart, toggleCart, fetchCategories } = useDashboardStore();
  const { categories: blogCategories } = useBlogStore();
  const router = useRouter();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [, setIsLoading] = useState(true);
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
        <div className="flex h-20 sm:h-24 w-full items-center justify-between z-10 relative">
          {/* Mobile Menu Button - Only visible on mobile */}
          <div className="lg:hidden z-20">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-primary">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Mở menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-primary text-white">
                <SheetHeader>
                  <SheetTitle className="text-white">GEM Store</SheetTitle>
                </SheetHeader>

                <div className="grid gap-2 pl-8 py-4 mt-8">
                  <div className="h-px bg-white/30 my-3" />
                  <Link
                    href="/products?collectionId=3"
                    className="flex w-full items-center py-2 text-sm font-medium hover:text-primary transition-colors hover:bg-white/30"
                    prefetch={false}
                  >
                    Trang sức
                  </Link>
                  <Link
                    href="/products?collectionId=4"
                    className="flex w-full items-center py-2 text-sm font-medium hover:text-primary transition-colors hover:bg-white/30"
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
                        className="flex w-full items-center py-2 text-sm hover:text-primary transition-colors hover:bg-white/30"
                        prefetch={false}
                      >
                        Tất cả
                      </Link>
                      {blogCategories.map((category) => (
                        <Link
                          key={category}
                          href={`/blog?category=${encodeURIComponent(category)}`}
                          className="flex w-full items-center py-2 text-sm hover:text-primary transition-colors hover:bg-white/30"
                          prefetch={false}
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="flex w-full items-center py-2 text-sm font-medium hover:text-primary transition-colors hover:bg-white/30"
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
                className="h-auto w-40 sm:w-48 md:w-52 lg:w-64"
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
              <SearchIcon className="h-6 w-6" />
            </Button>
          </div>

          {/* Cart Button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Giỏ hàng"
              className="relative p-2 text-white hover:text-primary"
              onClick={toggleCart}
            >
              <ShoppingBagIcon className="h-8 w-8" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 text-xs bg-white text-primary">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search - Expandable */}
        {isSearchOpen && (
          <div className="md:hidden mt-2 py-3 px-2 border-t border-white/20 animate-fadeIn bg-primary">
            <form onSubmit={handleSearch} className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/80" />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 pr-4 py-2 w-full border border-white/30 rounded-full focus:ring-2 focus:ring-primary-foreground focus:border-primary-foreground bg-primary text-white placeholder:text-white/70"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        )}

        {/* Navigation Menu - Full width, colored, and text updated for contrast */}
        <div className="border-t border-white/20 bg-primary py-1 w-full ml-12">
          <div className="h-12 flex items-center w-full">
            <NavigationMenu className="hidden lg:flex z-20 w-full" viewport={false}>
              <NavigationMenuList className="flex items-center gap-12 w-full">
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className="group inline-flex h-12 items-center justify-center px-4 text-sm font-medium text-white transition-colors hover:text-primary focus:text-primary-foreground focus:outline-none"
                    prefetch={false}
                  >
                    Trang chủ
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-white hover:text-primary bg-transparent hover:bg-primary/90">
                    Giới thiệu
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col p-4 w-48 rounded-md shadow-md bg-white">
                      <Link
                        href="/about/gem"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Về GEM
                      </Link>
                      <Link
                        href="/about/wholesale"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Kinh doanh sỉ /CTV
                      </Link>
                      <Link
                        href="/about/certification"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Kiểm định
                      </Link>
                      <Link
                        href="/about/careers"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Tuyển dụng
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-white hover:text-primary bg-transparent hover:bg-primary/90">
                    Trang sức
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col p-4 w-48 rounded-md shadow-md bg-white">
                      <Link
                        href="/products?category=bracelets"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Vòng tay
                      </Link>
                      <Link
                        href="/products?category=necklaces"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Mặt dây chuyền
                      </Link>
                      <Link
                        href="/products?category=rings"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Nhẫn
                      </Link>
                      <Link
                        href="/products?category=earrings"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Hoa Tai
                      </Link>
                      <Link
                        href="/products?category=solid-bracelets"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Vòng Bảng Nguyên Khối
                      </Link>
                      <Link
                        href="/products?category=tibetan-dzi"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        DZI Tây Tạng
                      </Link>
                      <Link
                        href="/products?category=pearls"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Ngọc trai
                      </Link>
                      <Link
                        href="/products?category=couple-bracelets"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Vòng cho Couple
                      </Link>
                      <Link
                        href="/products?category=custom-design"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Thiết kế theo yêu cầu
                      </Link>
                      <Link
                        href="/products?category=fashion-accessories"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Phụ kiện thời trang
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-white hover:text-primary bg-transparent hover:bg-primary/90">
                    Vật phẩm Phong Thủy
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col p-4 w-48 rounded-md shadow-md bg-white">
                      <Link
                        href="/products?category=agarwood"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Trầm Hương
                      </Link>
                      <Link
                        href="/products?category=sculptures"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Tượng điêu khắc
                      </Link>
                      <Link
                        href="/products?category=desk-items"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Vật phẩm để bàn
                      </Link>
                      <Link
                        href="/products?category=crushed-stones"
                        className="py-2 text-sm hover:text-primary transition-colors"
                        prefetch={false}
                      >
                        Đá vụn
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-white hover:text-primary bg-transparent hover:bg-primary/90">
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
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-white hover:text-primary bg-transparent hover:bg-primary/90">
                    Hỗ trợ
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 gap-4 p-4 w-[600px] rounded-md shadow-md bg-white">
                      {/* Dịch vụ khách hàng */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-primary mb-2">Dịch vụ khách hàng</h3>
                        <div className="space-y-1">
                          <Link
                            href="/support/customer-service/ring-size-guide"
                            className="block py-1.5 text-sm hover:text-primary transition-colors"
                            prefetch={false}
                          >
                            Hướng dẫn đo size trang sức
                          </Link>
                          <Link
                            href="/support/customer-service/jewelry-care-guide"
                            className="block py-1.5 text-sm hover:text-primary transition-colors"
                            prefetch={false}
                          >
                            Cẩm nang sử dụng trang sức
                          </Link>
                          <Link
                            href="/support/customer-service/payment-guide"
                            className="block py-1.5 text-sm hover:text-primary transition-colors"
                            prefetch={false}
                          >
                            Hướng dẫn thanh toán
                          </Link>
                          <Link
                            href="/support/customer-service/faq"
                            className="block py-1.5 text-sm hover:text-primary transition-colors"
                            prefetch={false}
                          >
                            Câu hỏi thường gặp
                          </Link>
                        </div>
                      </div>

                      {/* Chính sách GEM */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-primary mb-2">Chính sách GEM</h3>
                        <div className="space-y-1">
                          <Link
                            href="/support/policies/return-policy"
                            className="block py-1.5 text-sm hover:text-primary transition-colors"
                            prefetch={false}
                          >
                            Chính sách đổi trả
                          </Link>
                          <Link
                            href="/support/policies/deposit-shipping"
                            className="block py-1.5 text-sm hover:text-primary transition-colors"
                            prefetch={false}
                          >
                            Chính sách đặt cọc và giao hàng
                          </Link>
                          <Link
                            href="/support/policies/warranty"
                            className="block py-1.5 text-sm hover:text-primary transition-colors"
                            prefetch={false}
                          >
                            Chính sách bảo hành
                          </Link>
                          <Link
                            href="/support/policies/privacy"
                            className="block py-1.5 text-sm hover:text-primary transition-colors"
                            prefetch={false}
                          >
                            Chính sách bảo mật
                          </Link>
                        </div>
                      </div>

                      {/* Thông tin cửa hàng */}
                      <div className="col-span-2 pt-2 border-t border-gray-100">
                        <Link
                          href="/support/store-info"
                          className="block py-1.5 text-sm hover:text-primary transition-colors"
                          prefetch={false}
                        >
                          Thông tin cửa hàng
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/products/discount"
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

function MenuIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
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
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
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

function SearchIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
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
