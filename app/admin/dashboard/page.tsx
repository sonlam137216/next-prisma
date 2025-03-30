'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore';
import { Users, Package, ShoppingCart, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data store using Zustand
import { create } from 'zustand';

interface DashboardState {
  users: { total: number; new: number; active: number };
  products: { total: number; inStock: number; lowStock: number };
  orders: { total: number; pending: number; completed: number };
  loading: boolean;
  fetchDashboardData: () => Promise<void>;
}

const useDashboardStore = create<DashboardState>((set) => ({
  users: { total: 0, new: 0, active: 0 },
  products: { total: 0, inStock: 0, lowStock: 0 },
  orders: { total: 0, pending: 0, completed: 0 },
  loading: false,
  fetchDashboardData: async () => {
    set({ loading: true });
    
    // Simulate API call with setTimeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set({
      users: { total: 1248, new: 42, active: 879 },
      products: { total: 584, inStock: 390, lowStock: 32 },
      orders: { total: 2945, pending: 38, completed: 2907 },
      loading: false
    });
  }
}));

export default function AdminDashboardPage() {
  const router = useRouter();
  const { username } = useAuthStore();
  const { users, products, orders, loading, fetchDashboardData } = useDashboardStore();
  
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon,
    trend = 0,
    onClick
  }: { 
    title: string; 
    value: number; 
    description: string; 
    icon: React.ElementType;
    trend?: number;
    onClick?: () => void;
  }) => (
    <Card 
      className="hover:border-primary/50 transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <div className="flex items-center pt-1">
          {trend > 0 ? (
            <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
          ) : trend < 0 ? (
            <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
          ) : null}
          
          {trend !== 0 ? (
            <p className={`text-xs ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {Math.abs(trend)}% from last month
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {username || 'Admin'}. Here is a summary of your store.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {loading ? (
            renderLoadingState()
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  title="Total Users"
                  value={users.total}
                  description={`${users.new} new users this week`}
                  icon={Users}
                  trend={5.2}
                  onClick={() => router.push('/admin/users')}
                />
                <StatCard
                  title="Total Products"
                  value={products.total}
                  description={`${products.inStock} products in stock`}
                  icon={Package}
                  trend={-2.5}
                  onClick={() => router.push('/admin/products')}
                />
                <StatCard
                  title="Total Orders"
                  value={orders.total}
                  description={`${orders.pending} orders pending`}
                  icon={ShoppingCart}
                  trend={12.3}
                  onClick={() => router.push('/admin/orders')}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest actions in your store</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { user: 'John Doe', action: 'placed an order', time: '10 minutes ago' },
                        { user: 'Jane Smith', action: 'registered a new account', time: '1 hour ago' },
                        { user: 'Mike Johnson', action: 'updated their profile', time: '3 hours ago' },
                        { user: 'Sarah Williams', action: 'left a product review', time: '5 hours ago' }
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {activity.user} {activity.action}
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage your store quickly</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      onClick={() => router.push('/admin/products/new')}
                      className="w-full justify-start"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Add New Product
                    </Button>
                    <Button 
                      onClick={() => router.push('/admin/orders/pending')}
                      className="w-full justify-start"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      View Pending Orders
                    </Button>
                    <Button 
                      onClick={() => router.push('/admin/users/new')}
                      className="w-full justify-start"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Create User Account
                    </Button>
                    <Button 
                      onClick={() => router.push('/admin/settings')}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Full Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Detailed analytics are available in the Analytics section
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <Button onClick={() => router.push('/admin/analytics')}>
                Go to Analytics
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and download reports for your store
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <Button onClick={() => router.push('/admin/reports')}>
                View Reports
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}