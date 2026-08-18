import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api, formatPrice } from "@/lib/api";
import { useApp } from "@/lib/store";
import { statusVariant } from "@/lib/order-status";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "My Orders — Thrainax Store" },
      { name: "description", content: "View your Thrainax order history with totals and current status." },
      { property: "og:title", content: "My Orders — Thrainax Store" },
      { property: "og:description", content: "Your Thrainax order history." },
    ],
  }),
  component: MyOrders,
});

function MyOrders() {
  const { user, ready } = useApp();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: api.myOrders,
    enabled: !!user,
  });

  if (ready && !user)
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-foreground">My orders</h1>
        <p className="mt-2 text-muted-foreground">Sign in to see your order history.</p>
        <Button asChild className="mt-6">
          <Link to="/login">Sign in</Link>
        </Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">My orders</h1>

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          <Button asChild className="mt-4">
            <Link to="/products">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-card-foreground">Order #{o.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString()} · {o.items.length} item(s)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant(o.status)}>{o.status}</Badge>
                  <span className="font-semibold">{formatPrice(o.total)}</span>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/orders/$orderId" params={{ orderId: String(o.id) }}>
                      Track
                    </Link>
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
