import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Lightweight generated thumbnail — no external image dependencies. */
export function ProductThumb({
  product,
  className,
}: {
  product: Pick<Product, "name" | "imageColor">;
  className?: string;
}) {
  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div
      className={cn("flex w-full items-center justify-center", className)}
      style={{
        background: `linear-gradient(135deg, ${product.imageColor} 0%, ${product.imageColor}99 100%)`,
      }}
      aria-hidden
    >
      <span className="text-3xl font-semibold tracking-tight text-white/90">{initials}</span>
    </div>
  );
}
