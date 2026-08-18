import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/api";
import type { Product } from "@/lib/types";
import { ProductThumb } from "./ProductThumb";

export function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd?: (product: Product) => void;
}) {
  const out = product.stock <= 0;
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Link
        to="/products/$productId"
        params={{ productId: String(product.id) }}
        className="block"
        aria-label={product.name}
      >
        <ProductThumb product={product} className="h-40" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            to="/products/$productId"
            params={{ productId: String(product.id) }}
            className="text-sm font-semibold leading-snug text-card-foreground hover:underline"
          >
            {product.name}
          </Link>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-semibold text-foreground">{formatPrice(product.price)}</span>
          <span className={out ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
            {out ? "Out of stock" : `${product.stock} in stock`}
          </span>
        </div>
        {onAdd && (
          <Button size="sm" disabled={out} onClick={() => onAdd(product)} className="mt-2 w-full">
            Add to cart
          </Button>
        )}
      </div>
    </article>
  );
}
