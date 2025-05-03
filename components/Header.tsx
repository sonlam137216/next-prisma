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

export default function Header() {
  const { cart, toggleCart, categories, fetchCategories } = useDashboardStore();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories();
      setIsLoading(false);
    };

    loadCategories();
  }, [fetchCategories]);

  return (
    <div className="w-full sticky top-0 bg-white z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative">
        {/* Logo container that spans both sections */}
        <div className="absolute left-2 md:left-4 lg:left-4 top-0 bottom-0 flex items-center z-10 bg-white">
          <Link href="/" prefetch={false}>
            <Image
              src="/logo/LOGO-4.png"
              width={300}
              height={400}
              alt="Logo"
              priority
            />
          </Link>
        </div>

        {/* Upper Header: Search, Cart */}
        <div className="flex h-20 w-full items-center justify-between">
          {/* Mobile Menu Button - Only visible on mobile */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 lg:hidden z-20">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Mở menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <Link
                  href="/"
                  prefetch={false}
                  className="flex items-center my-6"
                >
                  <ShirtIcon className="h-8 w-8 mr-2" />
                  <span className="font-bold text-xl">ShadCN</span>
                </Link>
                <div className="grid gap-2 py-4">
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
                  <div className="h-px bg-gray-200 my-3" />
                  <Link
                    href="/products"
                    className="flex w-full items-center py-2 text-sm font-medium hover:text-primary transition-colors"
                    prefetch={false}
                  >
                    Tất cả sản phẩm
                  </Link>
                  <Link
                    href="/blog"
                    className="flex w-full items-center py-2 text-sm font-medium hover:text-primary transition-colors"
                    prefetch={false}
                  >
                    Blog
                  </Link>
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

          {/* Space for logo */}
          <div className="w-32 md:w-48 lg:w-64"></div>

          {/* Middle Section: Search Input */}
          <div className="hidden md:flex justify-center max-w-xl w-full mx-6">
            <div className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 pr-4 py-6 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Right Section: Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="lg"
              aria-label="Tìm kiếm"
              className="md:hidden"
            >
              <SearchIcon className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              aria-label="Giỏ hàng"
              className="relative p-2"
              onClick={toggleCart}
            >
              <ShoppingBagIcon className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Lower Header: Right-aligned Categories Menu */}
        <div className="border-t bg-white py-1">
          <div className="flex items-center justify-end h-12">
            {/* Space for logo */}
            <div className="w-32 md:w-48 lg:w-64"></div>

            {/* Right: Navigation Menu */}
            <NavigationMenu className="ml-auto">
              <NavigationMenuList className="flex items-center gap-4">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Giới thiệu</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col p-4">
                      <Link
                        href="/about/gia-tri"
                        className="py-2 text-sm hover:text-primary "
                        prefetch={false}
                      >
                        Giá trị
                      </Link>
                      <Link
                        href="/about/chat-luong"
                        className="py-2 text-sm hover:text-primary"
                        prefetch={false}
                      >
                        Chất lượng
                      </Link>
                      <Link
                        href="/about/lich-su"
                        className="py-2 text-sm hover:text-primary"
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
                    className="group inline-flex h-12 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors delay-100 duration-200 ease-in-out hover:bg-gray-100 hover:text-primary focus:bg-gray-100 focus:text-primary focus:outline-none"
                    prefetch={false}
                  >
                    Trang sức
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/products"
                    className="group inline-flex h-12 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors delay-100 duration-200 ease-in-out hover:bg-gray-100 hover:text-primary focus:bg-gray-100 focus:text-primary focus:outline-none"
                    prefetch={false}
                  >
                    Sản phẩm phong thủy
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/blog"
                    className="group inline-flex h-12 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors delay-100 duration-200 ease-in-out hover:bg-gray-100 hover:text-primary focus:bg-gray-100 focus:text-primary focus:outline-none"
                    prefetch={false}
                  >
                    Tin tức
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/contact"
                    className="group inline-flex h-12 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors delay-100 duration-200 ease-in-out hover:bg-gray-100 hover:text-primary focus:bg-gray-100 focus:text-primary focus:outline-none"
                    prefetch={false}
                  >
                    Liên hệ
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

function ShirtIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
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

function UserIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  );
}
