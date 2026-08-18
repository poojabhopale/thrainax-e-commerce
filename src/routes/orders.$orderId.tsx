import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api, formatPrice } from "@/lib/api";
import { statusVariant, TRACKING_STEPS } from "@/lib/order-status";

export const Route = createFileRoute("/orders/$orderId")({
  head: () => ({
    meta: [
      { title: "Order Tracking — Thrainax Store" },
      { name: "description", content: "Track your Thrainax order status from placed to delivered." },
      { property: "og:title", content: "Order Tracking — Thrainax Store" },
      { property: "og:description", content: "Live status for your Thrainax order." },
    ],
  }),
  component: OrderTracking,
});

function OrderTracking() {
  const { orderId } = Route.useParams();
  const id = Number(orderId);
  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => api.getOrder(id),
  });

  if (isLoading) return <p className="mx-auto max-w-4xl px-4 py-16 text-muted-foreground">Loading…</p>;
  if (error || !order)
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-xl font-semibold text-foreground">Order not found</h1>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/orders">Back to my orders</Link>
        </Button>
      </div>
    );

  const activeIndex = TRACKING_STEPS.indexOf(order.status as (typeof TRACKING_STEPS)[number]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/orders" className="text-sm text-primary hover:underline">
        ← Back to my orders
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Order #{order.id}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
      </div>

      {order.status === "CANCELLED" ? (
        <p className="mt-8 rounded-xl border border-border bg-card p-5 text-sm text-destructive">
          This order was cancelled.
        </p>
      ) : (
        <ol className="mt-8 grid gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-4">
          {TRACKING_STEPS.map((step, i) => {
            const done = i <= activeIndex;
            return (
              <li key={step} className="flex items-center gap-3">
                <span
                  className={
                    done
                      ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      : "flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground"
                  }
                >
                  {done ? <Check className="size-4" /> : i + 1}
                </span>
                <span className={done ? "text-sm font-medium text-foreground" : "text-sm text-muted-foreground"}>
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-card-foreground">Items</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {order.items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {i.name} × {i.quantity}
                </span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-card-foreground">Delivery details</h2>
          <p className="mt-3 text-sm text-muted-foreground">{order.customerName}</p>
          <p className="text-sm text-muted-foreground">{order.phone}</p>
          <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{order.address}</p>
        </section>
      </div>
    </div>
  );
}
