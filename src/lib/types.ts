export type Role = "USER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageColor: string;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageColor: string;
  stock: number;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "PLACED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export const ORDER_STATUSES: OrderStatus[] = [
  "PLACED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export interface Order {
  id: number;
  userId: number;
  customerName: string;
  address: string;
  phone: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}
