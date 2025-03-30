// app/admin/components/DashboardLayout.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore';
import {
  Users,
  Package,
  ShoppingCart,
  Home,
  Settings,
  BarChart,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Tags,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { username, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tags }, // Add this line
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all group ${
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-primary'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r bg-card transition-all duration-300 lg:relative ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16 overflow-hidden'
        }`}
      >
        <div className="flex h-14 items-center border-b px-4">
          <div className={`flex items-center ${!sidebarOpen && 'lg:hidden'}`}>
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto hidden lg:flex p-2 rounded-md hover:bg-muted"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        
        <div className="flex-1 overflow-auto py-4 px-3">
          <nav className="flex flex-col gap-1">
            <NavLinks />
          </nav>
        </div>
        
        <div className="border-t p-3">
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="w-full justify-start gap-2"
          >
            <LogOut size={16} />
            <span className={!sidebarOpen ? 'lg:hidden' : ''}>Log out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card transition-transform duration-300 ease-in-out lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-14 items-center justify-between border-b px-4">
          <span className="text-xl font-bold">Admin Panel</span>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-md hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto py-4 px-3">
          <nav className="flex flex-col gap-1">
            <NavLinks />
          </nav>
        </div>
        
        <div className="border-t p-3">
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="w-full justify-start gap-2"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:px-6">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-muted"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full bg-background pl-8 h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
          
          <Button size="icon" variant="ghost" className="relative">
            <Bell size={18} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {username?.substring(0, 2)?.toUpperCase() || 'AD'}
                  </AvatarFallback>
                </Avatar>
                <span>{username || 'Admin'}</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        
        {/* Page content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}