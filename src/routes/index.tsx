import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, Truck, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thrainax Store — Tech Gear for Makers" },
      {
        name: "description",
        content:
          "Shop headphones, keyboards, monitors and accessories at Thrainax. Fast delivery, secure checkout and live order tracking.",
      },
      { property: "og:title", content: "Thrainax Store — Tech Gear for Makers" },
      {
        property: "og:description",
        content: "Curated tech gear with secure checkout and live order tracking.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: api.listProducts });

  return (
    <div>
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">Thrainax Store</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
              Professional tech gear, delivered fast.
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              A full-stack commerce experience: browse the catalogue, manage your cart, place orders and
              track every shipment in real time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/products">Browse products</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/register">Create account</Link>
              </Button>
            </div>
          </div>
          <dl className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
            {[
              { icon: Truck, title: "Fast dispatch", text: "Orders packed within 24 hours." },
              { icon: ShieldCheck, title: "Secure checkout", text: "Role-based, token-protected APIs." },
              { icon: Undo2, title: "Easy returns", text: "7-day no-questions return window." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <Icon className="size-5 shrink-0 text-primary" />
                <div>
                  <dt className="text-sm font-semibold text-card-foreground">{title}</dt>
                  <dd className="text-sm text-muted-foreground">{text}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Featured products</h2>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
