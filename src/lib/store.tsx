import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, tokenStore } from "./api";
import type { CartItem, User } from "./types";

interface AppState {
  user: User | null;
  ready: boolean;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeCartItem: (itemId: number) => Promise<void>;
  clearCart: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const refreshCart = useCallback(async () => {
    try {
      setCart(await api.getCart());
    } catch {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (tokenStore.get()) {
        try {
          setUser(await api.me());
          await refreshCart();
        } catch {
          tokenStore.clear();
        }
      }
      setReady(true);
    })();
  }, [refreshCart]);

  const finishAuth = useCallback(
    async (res: { token: string; user: User }) => {
      tokenStore.set(res.token);
      setUser(res.user);
      await refreshCart();
      return res.user;
    },
    [refreshCart],
  );

  const value = useMemo<AppState>(
    () => ({
      user,
      ready,
      cart,
      cartCount: cart.reduce((s, i) => s + i.quantity, 0),
      cartTotal: cart.reduce((s, i) => s + i.price * i.quantity, 0),
      login: async (email, password) => finishAuth(await api.login({ email, password })),
      register: async (name, email, password) => finishAuth(await api.register({ name, email, password })),
      logout: () => {
        tokenStore.clear();
        setUser(null);
        setCart([]);
      },
      refreshCart,
      addToCart: async (productId, quantity = 1) => setCart(await api.addToCart(productId, quantity)),
      updateCartItem: async (itemId, quantity) => setCart(await api.updateCartItem(itemId, quantity)),
      removeCartItem: async (itemId) => setCart(await api.removeCartItem(itemId)),
      clearCart: () => setCart([]),
    }),
    [user, ready, cart, finishAuth, refreshCart],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
