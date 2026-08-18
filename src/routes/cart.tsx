import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductThumb } from "@/components/ProductThumb";
import { formatPrice } from "@/lib/api";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Thrainax Store" },
      { name: "description", content: "Review, update quantities or remove items before checkout." },
      { property: "og:title", content: "Your Cart — Thrainax Store" },
      { property: "og:description", content: "Review your Thrainax cart before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { user, cart, cartTotal, updateCartItem, removeCartItem } = useApp();

  const change = async (itemId: number, quantity: number) => {
    try {
      await updateCartItem(itemId, quantity);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  if (!user)
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Your cart</h1>
        <p className="mt-2 text-muted-foreground">Sign in to view the items in your cart.</p>
        <Button asChild className="mt-6">
          <Link to="/login">Sign in</Link>
        </Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Your cart</h1>

      {cart.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-4">
            <Link to="/products">Browse products</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-3">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-3"
              >
                <ProductThumb product={item} className="h-16 w-16 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-card-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    aria-label="Decrease quantity"
                    onClick={() => change(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    aria-label="Increase quantity"
                    onClick={() => change(item.id, item.quantity + 1)}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
                <p className="w-24 text-right text-sm font-semibold text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground"
                  aria-label="Remove item"
                  onClick={() => removeCartItem(item.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-card-foreground">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(cartTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>Free</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(cartTotal)}</dd>
              </div>
            </dl>
            <Button asChild className="mt-5 w-full">
              <Link to="/checkout">Proceed to checkout</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
