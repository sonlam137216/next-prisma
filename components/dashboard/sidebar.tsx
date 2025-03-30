import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Package2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const sidebarNavItems = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/dashboard/users",
    icon: Users,
  },
  {
    title: "Products",
    href: "/admin/dashboard/products",
    icon: Package2,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="h-full py-6">
        <div className="px-3 py-2">
          <h2 className="mb-6 px-4 text-lg font-semibold">Admin Dashboard</h2>
          <div className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    pathname === item.href && "bg-secondary"
                  )}
                >
                  {<item.icon className="h-4 w-4" />}
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}