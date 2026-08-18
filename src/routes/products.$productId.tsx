import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductThumb } from "@/components/ProductThumb";
import { api, formatPrice } from "@/lib/api";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/products/$productId")({
  head: () => ({
    meta: [
      { title: "Product Details — Thrainax Store" },
      { name: "description", content: "Full specification, price and stock availability for this product." },
      { property: "og:title", content: "Product Details — Thrainax Store" },
      { property: "og:description", content: "Specification, price and stock availability." },
    ],
  }),
  component: ProductDetails,
});

function ProductDetails() {
  const { productId } = Route.useParams();
  const id = Number(productId);
  const navigate = useNavigate();
  const { user, addToCart } = useApp();
  const [qty, setQty] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(id),
  });

  if (isLoading) return <p className="mx-auto max-w-6xl px-4 py-16 text-muted-foreground">Loading…</p>;
  if (error || !product)
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-xl font-semibold text-foreground">Product not found</h1>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/products">Back to products</Link>
        </Button>
      </div>
    );

  const handleAdd = async () => {
    if (!user) {
      toast.error("Please sign in to add items to your cart.");
      navigate({ to: "/login" });
      return;
    }
    try {
      await addToCart(product.id, qty);
      toast.success("Added to cart");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/products" className="text-sm text-primary hover:underline">
        ← Back to products
      </Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <ProductThumb product={product} className="h-72 rounded-xl md:h-96" />
        <div>
          <Badge variant="secondary">{product.category}</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{product.name}</h1>
          <p className="mt-3 text-muted-foreground">{product.description}</p>
          <p className="mt-6 text-3xl font-semibold text-foreground">{formatPrice(product.price)}</p>
          <p className={product.stock > 0 ? "mt-1 text-sm text-muted-foreground" : "mt-1 text-sm text-destructive"}>
            {product.stock > 0 ? `${product.stock} units in stock` : "Currently out of stock"}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Input
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-24"
              aria-label="Quantity"
            />
            <Button onClick={handleAdd} disabled={product.stock <= 0} size="lg">
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
