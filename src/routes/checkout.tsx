import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, formatPrice } from "@/lib/api";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Thrainax Store" },
      { name: "description", content: "Confirm your shipping details and place your Thrainax order." },
      { property: "og:title", content: "Checkout — Thrainax Store" },
      { property: "og:description", content: "Confirm shipping details and place your order." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { user, cart, cartTotal, refreshCart } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: "", phone: "" });
  const [busy, setBusy] = useState(false);

  if (!user)
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Checkout</h1>
        <p className="mt-2 text-muted-foreground">Sign in to complete your purchase.</p>
        <Button asChild className="mt-6">
          <Link to="/login">Sign in</Link>
        </Button>
      </div>
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const order = await api.placeOrder({ address: form.address.trim(), phone: form.phone.trim() });
      await refreshCart();
      toast.success(`Order #${order.id} placed`);
      navigate({ to: "/orders/$orderId", params: { orderId: String(order.id) } });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={user.name} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              required
              pattern="[0-9+\s-]{8,15}"
              placeholder="9876543210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Shipping address</Label>
            <Textarea
              id="address"
              required
              minLength={10}
              rows={4}
              placeholder="Flat, street, city, state, PIN"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy || cart.length === 0}>
            {busy ? "Placing order…" : `Place order · ${formatPrice(cartTotal)}`}
          </Button>
          {cart.length === 0 && (
            <p className="text-sm text-muted-foreground">Your cart is empty — add products first.</p>
          )}
        </form>

        <aside className="h-fit rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-card-foreground">Items</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {cart.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span className="min-w-0 truncate text-muted-foreground">
                  {i.name} × {i.quantity}
                </span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-3 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
