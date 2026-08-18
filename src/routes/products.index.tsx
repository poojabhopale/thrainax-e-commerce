import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "All Products — Thrainax Store" },
      {
        name: "description",
        content: "Search and filter the full Thrainax catalogue by category, price and availability.",
      },
      { property: "og:title", content: "All Products — Thrainax Store" },
      { property: "og:description", content: "Search and filter the full Thrainax catalogue." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: api.listProducts });
  const { user, addToCart } = useApp();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("relevance");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const visible = useMemo(() => {
    let list = products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())),
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, category, query, sort]);

  const handleAdd = async (productId: number) => {
    if (!user) {
      toast.error("Please sign in to add items to your cart.");
      navigate({ to: "/login" });
      return;
    }
    try {
      await addToCart(productId);
      toast.success("Added to cart");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Products</h1>
      <p className="mt-2 text-muted-foreground">Browse the catalogue and add items to your cart.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c === "all" ? "All categories" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Sort: default</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
            <SelectItem value="name">Name: A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="mt-10 text-muted-foreground">Loading products…</p>
      ) : visible.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No products match your filters.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={(prod) => handleAdd(prod.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
