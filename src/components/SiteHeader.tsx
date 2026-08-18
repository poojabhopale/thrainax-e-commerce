import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

const navLink = "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

export function SiteHeader() {
  const { user, cartCount, logout } = useApp();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link to="/" className="text-lg font-semibold tracking-tight text-foreground">
          Thrainax<span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-5 sm:flex">
          <Link to="/products" className={navLink} activeProps={{ className: "text-foreground" }}>
            Products
          </Link>
          {user && (
            <Link to="/orders" className={navLink} activeProps={{ className: "text-foreground" }}>
              My Orders
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link to="/admin" className={navLink} activeProps={{ className: "text-foreground" }}>
              Admin
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="relative">
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart className="size-4" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground md:inline">{user.name}</span>
              {user.role === "ADMIN" && (
                <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                  <Link to="/admin">
                    <LayoutDashboard className="size-4" /> Dashboard
                  </Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p className="flex items-center gap-2">
          <Package className="size-4" /> Thrainax Internship E-Commerce
        </p>
        <p>React + Spring Boot + MySQL</p>
      </div>
    </footer>
  );
}
