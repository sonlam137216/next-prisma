// app/store/orderStore.ts
import { create } from "zustand";
import axios from "axios";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type PaymentMethod = "CARD" | "COD";

export interface OrderItem {
  id?: number;
  productId: number;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Order {
  id?: number;
  orderNumber?: string;
  total: number;
  status?: OrderStatus;
  paymentMethod: PaymentMethod;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  orderItems: OrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalOrders: number;
  totalPages: number;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;

  // Pagination methods
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Order methods
  fetchOrders: (page?: number, pageSize?: number) => Promise<void>;
  fetchOrderById: (id: number) => Promise<void>;
  createOrder: (order: Order) => Promise<boolean>;
  updateOrderStatus: (id: number, status: OrderStatus) => Promise<boolean>;
  deleteOrder: (id: number) => Promise<boolean>;
  setCurrentOrder: (order: Order | null) => void;
}

// Create axios instance with default configuration
const api = axios.create({
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    totalOrders: 0,
    totalPages: 1,
  },

  setPage: (page: number) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        page,
      },
    }));
    // Fetch orders for the new page
    get().fetchOrders(page, get().pagination.pageSize);
  },

  setPageSize: (pageSize: number) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        pageSize,
        // Reset to page 1 when changing page size
        page: 1,
      },
    }));
    // Fetch orders with new page size
    get().fetchOrders(1, pageSize);
  },

  fetchOrders: async (page?: number, pageSize?: number) => {
    const currentPage = page || get().pagination.page;
    const currentPageSize = pageSize || get().pagination.pageSize;

    set({ loading: true, error: null });
    try {
      const response = await api.get(
        `/api/admin/orders?page=${currentPage}&pageSize=${currentPageSize}`
      );

      set({
        orders: response.data.orders,
        pagination: {
          page: currentPage,
          pageSize: currentPageSize,
          totalOrders: response.data.totalOrders,
          totalPages: response.data.totalPages,
        },
      });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchOrderById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/admin/orders/${id}`);
      set({ currentOrder: response.data.order });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  createOrder: async (order: Order) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/api/orders", order);

      // Update the orders list if we're in admin context
      if (window.location.pathname.includes("/admin")) {
        set((state) => ({
          orders: [...state.orders, response.data.order],
        }));
      }

      return true;
    } catch (error) {
      console.error('Failed to create order:', error);
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || error.message,
        });
      } else {
        set({
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      }

      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (id: number, status: OrderStatus) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/api/admin/orders/${id}`, { status });

      // Update the orders list and current order
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        currentOrder:
          state.currentOrder?.id === id
            ? { ...state.currentOrder, status }
            : state.currentOrder,
      }));

      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || error.message,
        });
      } else {
        set({
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      }

      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteOrder: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/api/admin/orders/${id}`);

      // Update pagination counts and remove the order from the list
      set((state) => {
        const newTotalOrders = state.pagination.totalOrders - 1;
        const newTotalPages = Math.max(
          1,
          Math.ceil(newTotalOrders / state.pagination.pageSize)
        );

        return {
          orders: state.orders.filter((o) => o.id !== id),
          currentOrder:
            state.currentOrder?.id === id ? null : state.currentOrder,
          pagination: {
            ...state.pagination,
            totalOrders: newTotalOrders,
            totalPages: newTotalPages,
            // Adjust current page if necessary
            page:
              state.pagination.page > newTotalPages
                ? newTotalPages
                : state.pagination.page,
          },
        };
      });

      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || error.message,
        });
      } else {
        set({
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      }

      return false;
    } finally {
      set({ loading: false });
    }
  },

  setCurrentOrder: (order: Order | null) => {
    set({ currentOrder: order });
  },
}));
