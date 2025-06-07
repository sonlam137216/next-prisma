"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Eye, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle, 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrderStore, OrderStatus } from "@/app/store/orderStore";

export default function OrdersPage() {
  const { 
    orders, 
    pagination, 
    loading,
    currentOrder,
    fetchOrders, 
    fetchOrderById,
    updateOrderStatus, 
    deleteOrder,
    setPage
  } = useOrderStore();
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // View order details
  const handleViewOrder = async (id: number) => {
    await fetchOrderById(id);
    setViewDialogOpen(true);
  };

  // Handle status change
  const handleStatusChange = async (id: number, status: OrderStatus) => {
    await updateOrderStatus(id, status);
  };

  // Prepare to delete order
  const handleDeleteClick = (id: number) => {
    setSelectedOrderId(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders Management</h1>
      </div>

      {/* Orders Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
                  <TableCell>{new Date(order.createdAt!).toLocaleDateString()}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="default">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewOrder(order.id!)}>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => handleDeleteClick(order.id!)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </Button>
          <div className="text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(pagination.totalPages, pagination.page + 1))}
            disabled={pagination.page === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </Button>
        </div>
      )}

      {/* View Order Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="w-screen max-w-none p-0 max-h-[98vh] overflow-y-auto">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Package className="mr-2" />
                Order Details
                {currentOrder && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    #{currentOrder.orderNumber}
                  </span>
                )}
              </DialogTitle>
              <DialogDescription>
                {currentOrder && new Date(currentOrder.createdAt!).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            {currentOrder && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Customer Information */}
                  <div className="space-y-4 pr-10">
                    <h3 className="font-semibold">Customer Information</h3>
                    <div className="grid grid-cols-1 gap-1 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {currentOrder.firstName} {currentOrder.lastName}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {currentOrder.email}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {currentOrder.phone}
                      </div>
                      <div>
                        <span className="font-medium">Address:</span> {currentOrder.address}, {currentOrder.city}, {currentOrder.country} {currentOrder.postalCode}
                      </div>
                    </div>
                  </div>

                  {/* Order Status */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Order Status</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Status:</span> 
                        <Badge variant="default">
                          {currentOrder.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Change Status:</span>
                        <Select 
                          value={currentOrder.status as string}
                          onValueChange={(value) => handleStatusChange(currentOrder.id!, value as OrderStatus)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">PENDING</SelectItem>
                            <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                            <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                            <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <span className="font-medium">Payment Method:</span> {currentOrder.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentOrder.orderItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="flex items-center gap-2">
                              {item.imageUrl && (
                                <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden relative">
                                  <Image 
                                    src={item.imageUrl} 
                                    alt={item.name} 
                                    width={40}
                                    height={40}
                                    className="object-cover h-full w-full" 
                                  />
                                </div>
                              )}
                              <span>{item.name}</span>
                            </TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                          <TableCell className="text-right font-bold">${currentOrder.total.toFixed(2)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order
              and all its items from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (selectedOrderId) {
                  deleteOrder(selectedOrderId);
                  setDeleteDialogOpen(false);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}