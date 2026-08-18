/**
 * REST client for the Spring Boot backend (see /backend).
 *
 * Base URL comes from VITE_API_URL (e.g. http://localhost:8080/api).
 * When it is not configured, a browser-local mock that mirrors the exact same
 * REST contract is used so the UI stays usable in the hosted preview.
 */
import type { CartItem, Order, OrderStatus, Product, Role, User } from "./types";

const BASE_URL = import.meta.env['VITE_API_URL'] as string | undefined;

export interface AuthResponse {
  token: string;
  user: User;
}

const TOKEN_KEY = "thrainax.token";

export const tokenStore = {
  get: () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const token = tokenStore.get();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

/* ------------------------------------------------------------------ mock db */

interface MockDb {
  users: (User & { password: string })[];
  products: Product[];
  carts: Record<number, CartItem[]>;
  orders: Order[];
  seq: number;
}

const DB_KEY = "thrainax.db";
const COLORS = ["#0f766e", "#1e3a5f", "#b45309", "#7c2d12", "#155e75", "#3f6212"];

function seed(): MockDb {
  const names: [string, string, string, number, number][] = [
    ["Aurora Wireless Headphones", "Audio", "Active noise cancelling over-ear headphones with 40h battery life.", 8999, 24],
    ["Nimbus Mechanical Keyboard", "Peripherals", "Hot-swappable 75% keyboard with tactile switches and RGB.", 5499, 40],
    ["Vector Ergonomic Mouse", "Peripherals", "Lightweight 26k DPI sensor mouse built for long sessions.", 2499, 60],
    ["Helios 27\" 4K Monitor", "Displays", "IPS panel, 99% sRGB, USB-C power delivery for laptops.", 27999, 12],
    ["Cobalt USB-C Hub", "Accessories", "8-in-1 hub with HDMI 4K60, ethernet and 100W passthrough.", 3299, 75],
    ["Sentinel Laptop Backpack", "Accessories", "Water resistant 22L bag with padded 16-inch laptop sleeve.", 3799, 35],
    ["Pulse Smart Fitness Band", "Wearables", "Heart-rate, SpO2 and sleep tracking with 10-day battery.", 2999, 50],
    ["Orbit Bluetooth Speaker", "Audio", "360° sound, IPX7 waterproof, 20h playtime.", 4499, 28],
  ];
  const products: Product[] = names.map(([name, category, description, price, stock], i) => ({
    id: i + 1,
    name,
    category,
    description,
    price,
    stock,
    imageColor: COLORS[i % COLORS.length]!,
  }));
  return {
    users: [
      { id: 1, name: "Admin", email: "admin@thrainax.com", password: "admin123", role: "ADMIN" },
      { id: 2, name: "Demo User", email: "user@thrainax.com", password: "user123", role: "USER" },
    ],
    products,
    carts: {},
    orders: [],
    seq: 100,
  };
}

function db(): MockDb {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const fresh = seed();
    localStorage.setItem(DB_KEY, JSON.stringify(fresh));
    return fresh;
  }
  return JSON.parse(raw) as MockDb;
}

function save(d: MockDb) {
  localStorage.setItem(DB_KEY, JSON.stringify(d));
}

function currentUser(d: MockDb): User & { password: string } {
  const token = tokenStore.get();
  const id = Number(token?.replace("mock-", ""));
  const user = d.users.find((u) => u.id === id);
  if (!user) throw new Error("Unauthorized. Please sign in again.");
  return user;
}

function requireAdmin(d: MockDb) {
  const u = currentUser(d);
  if (u.role !== "ADMIN") throw new Error("Access denied: admin role required.");
  return u;
}

const strip = (u: User & { password: string }): User => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
});

/* --------------------------------------------------------------------- api */

const useMock = !BASE_URL;

export const api = {
  register: async (input: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    if (!useMock) return http<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(input) });
    const d = db();
    if (d.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase()))
      throw new Error("An account with that email already exists.");
    const user = { id: ++d.seq, ...input, role: "USER" as Role };
    d.users.push(user);
    save(d);
    return { token: `mock-${user.id}`, user: strip(user) };
  },

  login: async (input: { email: string; password: string }): Promise<AuthResponse> => {
    if (!useMock) return http<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(input) });
    const d = db();
    const user = d.users.find(
      (u) => u.email.toLowerCase() === input.email.toLowerCase() && u.password === input.password,
    );
    if (!user) throw new Error("Invalid email or password.");
    return { token: `mock-${user.id}`, user: strip(user) };
  },

  me: async (): Promise<User> => {
    if (!useMock) return http<User>("/auth/me");
    return strip(currentUser(db()));
  },

  listProducts: async (): Promise<Product[]> => {
    if (!useMock) return http<Product[]>("/products");
    return db().products;
  },

  getProduct: async (id: number): Promise<Product> => {
    if (!useMock) return http<Product>(`/products/${id}`);
    const p = db().products.find((x) => x.id === id);
    if (!p) throw new Error("Product not found.");
    return p;
  },

  createProduct: async (input: Omit<Product, "id" | "imageColor">): Promise<Product> => {
    if (!useMock) return http<Product>("/admin/products", { method: "POST", body: JSON.stringify(input) });
    const d = db();
    requireAdmin(d);
    const product: Product = {
      ...input,
      id: ++d.seq,
      imageColor: COLORS[d.products.length % COLORS.length]!,
    };
    d.products.push(product);
    save(d);
    return product;
  },

  updateProduct: async (id: number, input: Omit<Product, "id" | "imageColor">): Promise<Product> => {
    if (!useMock) return http<Product>(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(input) });
    const d = db();
    requireAdmin(d);
    const idx = d.products.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error("Product not found.");
    d.products[idx] = { ...d.products[idx]!, ...input };
    save(d);
    return d.products[idx]!;
  },

  deleteProduct: async (id: number): Promise<void> => {
    if (!useMock) return http<void>(`/admin/products/${id}`, { method: "DELETE" });
    const d = db();
    requireAdmin(d);
    d.products = d.products.filter((p) => p.id !== id);
    save(d);
  },

  getCart: async (): Promise<CartItem[]> => {
    if (!useMock) return http<CartItem[]>("/cart");
    const d = db();
    const u = currentUser(d);
    return (d.carts[u.id] ?? []).map((item) => ({
      ...item,
      stock: d.products.find((p) => p.id === item.productId)?.stock ?? 0,
    }));
  },

  addToCart: async (productId: number, quantity = 1): Promise<CartItem[]> => {
    if (!useMock)
      return http<CartItem[]>("/cart/items", { method: "POST", body: JSON.stringify({ productId, quantity }) });
    const d = db();
    const u = currentUser(d);
    const product = d.products.find((p) => p.id === productId);
    if (!product) throw new Error("Product not found.");
    const items = d.carts[u.id] ?? [];
    const existing = items.find((i) => i.productId === productId);
    const nextQty = (existing?.quantity ?? 0) + quantity;
    if (nextQty > product.stock) throw new Error(`Only ${product.stock} unit(s) in stock.`);
    if (existing) existing.quantity = nextQty;
    else
      items.push({
        id: ++d.seq,
        productId,
        name: product.name,
        price: product.price,
        quantity,
        imageColor: product.imageColor,
        stock: product.stock,
      });
    d.carts[u.id] = items;
    save(d);
    return items;
  },

  updateCartItem: async (itemId: number, quantity: number): Promise<CartItem[]> => {
    if (!useMock)
      return http<CartItem[]>(`/cart/items/${itemId}`, { method: "PUT", body: JSON.stringify({ quantity }) });
    const d = db();
    const u = currentUser(d);
    const items = d.carts[u.id] ?? [];
    const item = items.find((i) => i.id === itemId);
    if (!item) throw new Error("Cart item not found.");
    const stock = d.products.find((p) => p.id === item.productId)?.stock ?? 0;
    if (quantity > stock) throw new Error(`Only ${stock} unit(s) in stock.`);
    item.quantity = Math.max(1, quantity);
    d.carts[u.id] = items;
    save(d);
    return items;
  },

  removeCartItem: async (itemId: number): Promise<CartItem[]> => {
    if (!useMock) return http<CartItem[]>(`/cart/items/${itemId}`, { method: "DELETE" });
    const d = db();
    const u = currentUser(d);
    d.carts[u.id] = (d.carts[u.id] ?? []).filter((i) => i.id !== itemId);
    save(d);
    return d.carts[u.id]!;
  },

  placeOrder: async (input: { address: string; phone: string }): Promise<Order> => {
    if (!useMock) return http<Order>("/orders", { method: "POST", body: JSON.stringify(input) });
    const d = db();
    const u = currentUser(d);
    const items = d.carts[u.id] ?? [];
    if (!items.length) throw new Error("Your cart is empty.");
    for (const item of items) {
      const product = d.products.find((p) => p.id === item.productId);
      if (!product || product.stock < item.quantity)
        throw new Error(`Insufficient stock for ${item.name}.`);
    }
    items.forEach((item) => {
      const product = d.products.find((p) => p.id === item.productId)!;
      product.stock -= item.quantity;
    });
    const order: Order = {
      id: ++d.seq,
      userId: u.id,
      customerName: u.name,
      address: input.address,
      phone: input.phone,
      total: items.reduce((s, i) => s + i.price * i.quantity, 0),
      status: "PLACED",
      createdAt: new Date().toISOString(),
      items: items.map(({ productId, name, price, quantity }) => ({ productId, name, price, quantity })),
    };
    d.orders.unshift(order);
    d.carts[u.id] = [];
    save(d);
    return order;
  },

  myOrders: async (): Promise<Order[]> => {
    if (!useMock) return http<Order[]>("/orders");
    const d = db();
    const u = currentUser(d);
    return d.orders.filter((o) => o.userId === u.id);
  },

  getOrder: async (id: number): Promise<Order> => {
    if (!useMock) return http<Order>(`/orders/${id}`);
    const d = db();
    const u = currentUser(d);
    const order = d.orders.find((o) => o.id === id);
    if (!order || (order.userId !== u.id && u.role !== "ADMIN")) throw new Error("Order not found.");
    return order;
  },

  allOrders: async (): Promise<Order[]> => {
    if (!useMock) return http<Order[]>("/admin/orders");
    const d = db();
    requireAdmin(d);
    return d.orders;
  },

  updateOrderStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    if (!useMock)
      return http<Order>(`/admin/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });
    const d = db();
    requireAdmin(d);
    const order = d.orders.find((o) => o.id === id);
    if (!order) throw new Error("Order not found.");
    order.status = status;
    save(d);
    return order;
  },
};

export const formatPrice = (paise: number) =>
  `₹${paise.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;
